const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const isWin = process.platform === "win32";

async function run(command, args) {
  const argsAsString = args.join(" ");
  console.log("run:|", command, argsAsString);
  await new Promise((resolve, reject) => {
    const child = childProcess.spawn(command, args, { shell: true });
    child.stdout.on(
      "data",
      (output) =>
        output &&
        output.toString() &&
        console.info("    |", output.toString().trim())
    );
    child.stderr.on(
      "data",
      (output) =>
        output &&
        output.toString() &&
        console.error("E   |", output.toString().trim())
    );
    child.on("exit", (code) => (code == 0 ? resolve : reject)());
    child.on("error", (error) => {
      console.error("err:|", error);
      reject(error);
    });
  });
}

async function runNodeBin(command, args) {
  return run(path.join(__dirname, "..", "node_modules", ".bin", command), args);
}

async function forAllFiles(folder, extension, f) {
  const filenames = fs.readdirSync(folder).filter((_) => _.endsWith(extension));
  for (let i = 0; i < filenames.length; i++) {
    await f(path.join(folder, filenames[i]), filenames[i]);
  }
}

async function compileProtos() {
  await run("npm", [
    "rebuild",
    "--target=11.2.1",
    "--runtime=electron",
    "--dist-url=https://atom.io/download/electron",
  ]);
  const allProtos = [];
  await forAllFiles("src/ttf/protos", ".proto", (f) => allProtos.push(f));
  await runNodeBin("grpc_tools_node_protoc", [
    `--js_out=import_style=commonjs,binary:./out/ttf`,
    `--grpc_out=./out/ttf`,
    `--plugin=protoc-gen-grpc=${path.join(
      __dirname,
      "..",
      "node_modules",
      ".bin",
      "grpc_tools_node_protoc_plugin" + (isWin ? ".cmd" : "")
    )}`,
    `--proto_path=./src/ttf/protos`,
    ...allProtos,
  ]);
  await runNodeBin("grpc_tools_node_protoc", [
    `--ts_out=./src/ttf`,
    `--plugin=protoc-gen-ts=${path.join(
      __dirname,
      "..",
      "node_modules/.bin/protoc-gen-ts" + (isWin ? ".cmd" : "")
    )}`,
    `--proto_path=./src/ttf/protos`,
    ...allProtos,
  ]);
}

function createIfNotExists(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
}

(async function () {
  const watchMode = (process.argv[2] || "").trim() === "-w";

  await run("npm", ["install"]);
  createIfNotExists("out");
  createIfNotExists("out/ttf");
  createIfNotExists("out/panels");
  createIfNotExists("out/panels/bundles");
  await compileProtos();
  await runNodeBin("tsc", ["-v"]);
  await runNodeBin("tsc", ["-p", "./"]);
  await runNodeBin("tsc", ["-p", "./src/panels"]);
  await forAllFiles("src/panels", ".scss", (file) =>
    runNodeBin("node-sass", [file, "-o", "out/panels"])
  );
  await forAllFiles("out/panels", ".main.js", (file, basename) =>
    runNodeBin("browserify", [
      "-t [ babelify --presets [ @babel/preset-react ] ]",
      file,
      "-o out/panels/bundles/" + basename,
    ])
  );

  if (watchMode) {
    // These exact strings are matched by tasks.json. They signal that the initial compilation is finished
    // and that the debugger can be launched:
    const canary = function () {
      console.log("visual-token-designer can now be launched");
      console.log("visual-token-designer watching for incremental changes");
    };
    canary();
    setInterval(canary, 2000);

    const tasks = [];
    tasks.push(runNodeBin("tsc", ["-watch", "-p", "./"]));
    tasks.push(runNodeBin("tsc", ["-watch", "-p", "./src/panels"]));
    await forAllFiles("src/panels", ".scss", (file) =>
      tasks.push(runNodeBin("node-sass", [file, "-wo", "out/panels"]))
    );
    await forAllFiles("out/panels", ".main.js", (file, basename) =>
      tasks.push(
        runNodeBin("watchify", [
          "-t [ babelify --presets [ @babel/preset-react ] ]",
          file,
          "-o out/panels/bundles/" + basename,
        ])
      )
    );
    await Promise.all(tasks);
  }
})();
