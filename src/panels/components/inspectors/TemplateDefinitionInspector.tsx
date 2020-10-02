import React from "react";

import { TemplateDefinition } from "../../../ttf/core_pb";

import ArtifactReference from "../ArtifactReference";
import BaseReferenceInspector from "./BaseReferenceInspector";
import BehaviorReferenceInspector from "./BehaviorReferenceInspector";
import BehaviorGroupReferenceInspector from "./BehaviorGroupReferenceInspector";
import PropertySetReferenceInspector from "./PropertySetReferenceInspector";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: TemplateDefinition.AsObject;
  loadFormula?: (tooling: string) => void;
};

export default function TemplateDefinitionInspector({
  taxonomy,
  artifact,
  loadFormula,
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
      {artifact.childTokensList.map((_, i) => (
        <div key={i}>
          <div style={{ marginTop: 25 }}>
            <b>Child token #{i + 1}:</b>
          </div>
          <div style={{ marginLeft: 25 }}>
            <TemplateDefinitionInspector
              taxonomy={taxonomy}
              artifact={_}
              loadFormula={loadFormula}
            />
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
      {artifact.behaviorsList.map((_, i) => (
        <div key={i}>
          <div style={{ marginTop: 25 }}>
            <b>Behavior #{i + 1}:</b>
          </div>
          <BehaviorReferenceInspector taxonomy={taxonomy} artifact={_} />
        </div>
      ))}
      {artifact.behaviorGroupsList.map((_, i) => (
        <div key={i}>
          <div style={{ marginTop: 25 }}>
            <b>Behavior group #{i + 1}:</b>
          </div>
          <BehaviorGroupReferenceInspector taxonomy={taxonomy} artifact={_} />
        </div>
      ))}
      {artifact.propertySetsList.map((_, i) => (
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
