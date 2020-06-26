const fs = require("fs");
const grpc = require("grpc");
const path = require("path");
const protos = require("../out/ttf/protobufs");

/*
const grpcClient = new (grpc.makeGenericClientConstructor({}))(
  "127.0.0.1:8086",
  grpc.credentials.createInsecure()
);

const rpcImpl = function (method, requestData, callback) {
  grpcClient.makeUnaryRequest(
    method.name,
    (arg) => arg,
    (arg) => arg,
    requestData,
    callback
  );
};

const ttfConnection = protos.taxonomy.Service.create(rpcImpl);
*/
const ttfConnection = protos.taxonomy.model.ServiceClient.create();
ttfConnection.

ttfConnection = new ttfClient.ServiceClient(
  "127.0.0.1:8086",
  grpc.credentials.createInsecure()
);


const version = protos.taxonomy.model.TaxonomyVersion.create();
version.version = "1.0";

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
