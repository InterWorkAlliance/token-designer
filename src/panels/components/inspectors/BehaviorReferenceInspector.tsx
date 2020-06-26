import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import ArtifactInspector from "./ArtifactInspector";
import ArtifactReference from "../ArtifactReference";
import ArtifactSymbolBox from "../ArtifactSymbolBox";
import { getArtifactById } from "../../getArtifactById";
import InvocationInspector from "./InvocationInspector";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact: taxonomy.model.core.IBehaviorReference;
};

export default function BehaviorReferenceInspector({
  taxonomy,
  artifact,
}: Props) {
  let poachFrom: any = {};
  if (artifact.reference) {
    poachFrom = getArtifactById(taxonomy, artifact.reference.id) || {};
  }

  let mergedBehavior: taxonomy.model.core.IBehavior | undefined = {
    constructorType: artifact.constructorType || poachFrom.constructorType,
    invocations: artifact.invocations?.length
      ? artifact.invocations
      : poachFrom.invocations,
    isExternal:
      artifact.isExternal === undefined
        ? poachFrom.isExternal
        : artifact.isExternal,
    properties: artifact.properties?.length
      ? artifact.properties
      : poachFrom.properties,
    artifact: poachFrom.artifact,
    constructor_: artifact.constructor_ || poachFrom.constructor_,
  };

  if (!mergedBehavior.invocations || !mergedBehavior.properties) {
    mergedBehavior = undefined;
  }

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
      {!!artifact.appliesTo?.length && (
        <>
          <p>
            <u>Applies to:</u>
          </p>
          <p>
            {artifact.appliesTo?.map((_) => (
              <ArtifactSymbolBox key={_.id||""} symbol={_} />
            ))}
          </p>
          <br style={{ clear: "both" }} />
        </>
      )}
      {!!artifact.influenceBindings?.length && (
        <>
          <p>
            <u>Influence bindings:</u>
          </p>
          <ul>
            {artifact.influenceBindings?.map((_) => (
              <li key={_.influencedId||""}>
                <b>
                  {(_.influenceType||"Unknonw influence on")}
                  {" invocation " + _.influencedInvocation?.name ||
                    "unknown invocation"}
                </b>{" "}
                (from{" "}
                <ArtifactReference taxonomy={taxonomy} id={_.influencedId} />)
                {!!_.influencedInvocation && (
                  <div>
                    <br />
                    <InvocationInspector invocation={_.influencedInvocation} />
                  </div>
                )}
                {!!_.influencingInvocation && (
                  <div>
                    <h3>Influence:</h3>
                    <InvocationInspector invocation={_.influencingInvocation} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {mergedBehavior ? (
        <>
          <p>
            <u>Referenced behavior:</u>
          </p>
          <div style={{ marginLeft: 25 }}>
            <ArtifactInspector
              artifactType="behavior"
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
