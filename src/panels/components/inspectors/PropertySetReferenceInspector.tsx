import React from "react";

import { PropertySetReference, PropertySet } from "../../../ttf/core_pb";

import ArtifactInspector from "./ArtifactInspector";
import { getArtifactById } from "../../getArtifactById";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";
import PropertySetInspector from "./PropertySetInspector";

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
  artifact: PropertySetReference.AsObject;
};

export default function PropertySetReferenceInspector({
  taxonomy,
  artifact,
}: Props) {
  let poachFrom: any = {};
  if (artifact.reference) {
    poachFrom = getArtifactById(taxonomy, artifact.reference.id) || {};
  }

  let mergedBehavior: PropertySet.AsObject | undefined = {
    artifact: thisOrThat("artifact", artifact, poachFrom),
    propertiesList: thisOrThat("propertiesList", artifact, poachFrom),
    representationType: thisOrThat("representationType", artifact, poachFrom),
    propertySetsList: thisOrThat("propertySetsList", artifact, poachFrom),
    repeated: thisOrThat("repeated", artifact, poachFrom),
  };

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        {mergedBehavior?.artifact?.name || "Unknown"}
      </h2>
      <p>
        <u>Repeated:</u>
        <ul>
          <li>{artifact.repeated ? "Yes" : "No"}</li>
        </ul>
      </p>
      {!!artifact.reference?.referenceNotes && (
        <p>
          <i>Note:</i> {artifact.reference.referenceNotes}
        </p>
      )}
      {mergedBehavior ? (
        <>
          <p>
            <u>Referenced property set:</u>
          </p>
          <div style={{ marginLeft: 25 }}>
            <ArtifactInspector
              artifactType="property-set"
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
      {!!artifact.propertySetsList.length && (
        <>
          <p>
            <u>Property sets:</u>
          </p>
          {artifact.propertySetsList.map((_, i) => (
            <PropertySetInspector key={i} taxonomy={taxonomy} artifact={_} />
          ))}
        </>
      )}
    </>
  );
}
