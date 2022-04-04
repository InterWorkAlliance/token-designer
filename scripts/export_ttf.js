const fs = require("fs");
const grpc = require("@grpc/grpc-js");
const path = require("path");
const ttfClient = require("../out/ttf/service_grpc_pb");
const ttfTaxonomy = require("../out/ttf/taxonomy_pb");

const ttfConnection = new ttfClient.ServiceClient(
  "127.0.0.1:8086",
  grpc.credentials.createInsecure()
);

const version = new ttfTaxonomy.TaxonomyVersion();
version.setVersion("1.2");

ttfConnection.getFullTaxonomy(version, (err, taxonomy) => {
  if (err) {
    console.error(err);
  } else {
    const serializedTaxonomy = taxonomy.serializeBinary();
    fs.writeFileSync(
      path.join(
        __dirname,
        "..",
        "resources",
        "ttf_snapshot",
        "ttf_taxonomy.bin"
      ),
      serializedTaxonomy
    );
  }
});
