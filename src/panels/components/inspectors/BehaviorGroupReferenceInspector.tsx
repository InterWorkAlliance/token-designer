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
  artifact: taxonomy.model.core.IBehaviorGroupReference;
};

export default function BehaviorGroupReferenceInspector({
  taxonomy,
  artifact,
}: Props) {
  let poachFrom: any = {};
  if (artifact.reference) {
    poachFrom = getArtifactById(taxonomy, artifact.reference.id) || {};
  }

  let mergedBehavior: taxonomy.model.core.IBehaviorGroup | undefined = {
    artifact: thisOrThat("artifact", artifact, poachFrom),
    behaviors: thisOrThat("behaviors", artifact, poachFrom),
    behaviorArtifacts: thisOrThat(
      "behaviorArtifacts",
      artifact,
      poachFrom
    ),
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
            <u>Referenced behavior group:</u>
          </p>
          <div style={{ marginLeft: 25 }}>
            <ArtifactInspector
              artifactType="behavior-group"
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
