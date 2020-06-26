import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import ArtifactReference from "../ArtifactReference";
import BaseReferenceInspector from "./BaseReferenceInspector";
import BehaviorReferenceInspector from "./BehaviorReferenceInspector";
import BehaviorGroupReferenceInspector from "./BehaviorGroupReferenceInspector";
import PropertySetReferenceInspector from "./PropertySetReferenceInspector";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact: taxonomy.model.core.ITemplateDefinition;
};

export default function TemplateDefinitionInspector({
  taxonomy,
  artifact,
}: Props) {
  return (
    <>
      {!!artifact.formulaReference && (
        <>
          <p>
            <u>Formula reference:</u>{" "}
            <ArtifactReference
              taxonomy={taxonomy}
              id={artifact.formulaReference.id}
            />
          </p>
          <ul>
            <li>{artifact.formulaReference.referenceNotes}</li>
          </ul>
        </>
      )}
      {artifact.childTokens?.map((_, i) => (
        <div key={i}>
          <div style={{ marginTop: 25 }}>
            <b>Child token #{i + 1}:</b>
          </div>
          <div style={{ marginLeft: 25 }}>
            <TemplateDefinitionInspector taxonomy={taxonomy} artifact={_} />
          </div>
        </div>
      ))}
      {!!artifact.tokenBase && (
        <>
          <div style={{ marginTop: 25 }}>
            <b>Token base:</b>
          </div>
          <BaseReferenceInspector
            taxonomy={taxonomy}
            artifact={artifact.tokenBase}
          />
        </>
      )}
      {artifact.behaviors?.map((_, i) => (
        <div key={i}>
          <div style={{ marginTop: 25 }}>
            <b>Behavior #{i + 1}:</b>
          </div>
          <BehaviorReferenceInspector taxonomy={taxonomy} artifact={_} />
        </div>
      ))}
      {artifact.behaviorGroups?.map((_, i) => (
        <div key={i}>
          <div style={{ marginTop: 25 }}>
            <b>Behavior group #{i + 1}:</b>
          </div>
          <BehaviorGroupReferenceInspector taxonomy={taxonomy} artifact={_} />
        </div>
      ))}
      {artifact.propertySets?.map((_, i) => (
        <div key={i}>
          <div style={{ marginTop: 25 }}>
            <b>Property set #{i + 1}:</b>
          </div>
          <PropertySetReferenceInspector taxonomy={taxonomy} artifact={_} />
        </div>
      ))}
    </>
  );
}
