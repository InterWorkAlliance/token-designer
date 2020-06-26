import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import ArtifactInspector from "./ArtifactInspector";
import { getArtifactById } from "../../getArtifactById";

function thisOrThat<T>(p: string, primary: any, secondary: any): T {
  if (primary[p] === undefined || primary[p] === null) {
    return secondary[p];
  }
  if (primary[p].length && primary[p].length === 0) {
    return secondary[p];
  }
  return primary[p] as T;
}

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact: taxonomy.model.core.IBaseReference;
};

export default function BaseReferenceInspector({ taxonomy, artifact }: Props) {
  let poachFrom: any = {};
  if (artifact.reference) {
    poachFrom = getArtifactById(taxonomy, artifact.reference.id) || {};
  }

  let mergedBehavior: taxonomy.model.core.IBase | undefined = {
    artifact: thisOrThat("artifact", artifact, poachFrom),
    constructor_: thisOrThat("constructor_", artifact, poachFrom),
    constructorName: thisOrThat("constructorName", artifact, poachFrom),
    decimals: thisOrThat("decimals", artifact, poachFrom),
    name: thisOrThat("name", artifact, poachFrom),
    owner: thisOrThat("owner", artifact, poachFrom),
    quantity: thisOrThat("quantity", artifact, poachFrom),
    representationType: thisOrThat("representationType", artifact, poachFrom),
    supply: thisOrThat("supply", artifact, poachFrom),
    symbol: thisOrThat("symbol", artifact, poachFrom),
    tokenProperties: thisOrThat("tokenProperties", artifact, poachFrom),
    tokenType: thisOrThat("tokenType", artifact, poachFrom),
    tokenUnit: thisOrThat("tokenUnit", artifact, poachFrom),
    valueType: thisOrThat("valueType", artifact, poachFrom),
  };

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        {mergedBehavior?.artifact?.name || "Unknown"}
      </h2>
      {!!artifact.reference?.referenceNotes && (
        <p>
          <i>Note:</i> {artifact.reference.referenceNotes}
        </p>
      )}
      {mergedBehavior ? (
        <>
          <p>
            <u>Referenced token base:</u>
          </p>
          <div style={{ marginLeft: 25 }}>
            <ArtifactInspector
              artifactType="token-base"
              artifact={mergedBehavior}
              taxonomy={taxonomy}
            />
          </div>
        </>
      ) : (
        <p>
          The referenced behavior ({artifact.reference?.id || "ID unknown"})
          could not be loaded.
        </p>
      )}
    </>
  );
}
