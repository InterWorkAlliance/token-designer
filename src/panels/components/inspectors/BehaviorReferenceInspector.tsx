import React from "react";

import { BehaviorReference, Behavior } from "../../../ttf/core_pb";

import ArtifactInspector from "./ArtifactInspector";
import ArtifactReference from "../ArtifactReference";
import ArtifactSymbolBox from "../ArtifactSymbolBox";
import { getArtifactById } from "../../getArtifactById";
import InvocationInspector from "./InvocationInspector";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: BehaviorReference.AsObject;
};

export default function BehaviorReferenceInspector({
  taxonomy,
  artifact,
}: Props) {
  let poachFrom: any = {};
  if (artifact.reference) {
    poachFrom = getArtifactById(taxonomy, artifact.reference.id) || {};
  }

  let mergedBehavior: Behavior.AsObject | undefined = {
    constructorType: artifact.constructorType || poachFrom.constructorType,
    invocationsList: artifact.invocationsList.length
      ? artifact.invocationsList
      : poachFrom.invocationsList,
    isExternal:
      artifact.isExternal === undefined
        ? poachFrom.isExternal
        : artifact.isExternal,
    propertiesList: artifact.propertiesList.length
      ? artifact.propertiesList
      : poachFrom.propertiesList,
    artifact: poachFrom.artifact,
    constructor: artifact.constructor || poachFrom.constructor,
  };

  if (!mergedBehavior.invocationsList || !mergedBehavior.propertiesList) {
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
      {!!artifact.appliesToList.length && (
        <>
          <p>
            <u>Applies to:</u>
          </p>
          <p>
            {artifact.appliesToList.map((_) => (
              <ArtifactSymbolBox key={_.id} symbol={_} />
            ))}
          </p>
          <br style={{ clear: "both" }} />
        </>
      )}
      {!!artifact.influenceBindingsList.length && (
        <>
          <p>
            <u>Influence bindings:</u>
          </p>
          <ul>
            {artifact.influenceBindingsList.map((_) => (
              <li key={_.influencedId}>
                <b>
                  {["Intercept", "Override"][_.influenceType] ||
                    "Unknown influence on"}{" "}
                  {"invocation " + _.influencedInvocation?.name ||
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
              editMode={false}
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
