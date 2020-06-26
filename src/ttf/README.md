The .proto files in the proto directory come from the TokenTaxonomyFramework: https://github.com/interwork-alliance/TokenTaxonomyFramework/tree/master/model/protos

The .d.ts files are generated from the protos by `npm run compile`

Any fields in the `.proto` files with the name `constructor` have been renamed to `constructor_` due to [this bug](https://github.com/protobufjs/protobuf.js/issues/1113) in `protobufjs`