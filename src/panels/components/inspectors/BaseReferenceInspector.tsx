import React from "react";

import { BaseReference, Base } from "../../../ttf/core_pb";

import ArtifactInspector from "./ArtifactInspector";
import { getArtifactById } from "../../getArtifactById";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

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
  taxonomy: TaxonomyAsObjects;
  artifact: BaseReference.AsObject;
};

export default function BaseReferenceInspector({ taxonomy, artifact }: Props) {
  let poachFrom: any = {};
  if (artifact.reference) {
    poachFrom = getArtifactById(taxonomy, artifact.reference.id) || {};
  }

  let mergedBehavior: Base.AsObject | undefined = {
    artifact: thisOrThat("artifact", artifact, poachFrom),
    constructor: thisOrThat("constructor", artifact, poachFrom),
    constructorName: thisOrThat("constructorName", artifact, poachFrom),
    decimals: thisOrThat("decimals", artifact, poachFrom),
    name: thisOrThat("name", artifact, poachFrom),
    owner: thisOrThat("owner", artifact, poachFrom),
    quantity: thisOrThat("quantity", artifact, poachFrom),
    representationType: thisOrThat("representationType", artifact, poachFrom),
    supply: thisOrThat("supply", artifact, poachFrom),
    symbol: thisOrThat("symbol", artifact, poachFrom),
    tokenPropertiesMap: thisOrThat("tokenPropertiesMap", artifact, poachFrom),
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
              editMode={false}
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
