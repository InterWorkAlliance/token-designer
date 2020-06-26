import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import BehaviorReferenceInspector from "./BehaviorReferenceInspector";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact: taxonomy.model.core.IBehaviorGroup;
};

export default function BehaviorGroupInspector({ taxonomy, artifact }: Props) {
  return (
    <>
      {!!artifact.behaviors?.length &&
        artifact.behaviors.map((_, i) => (
          <div key={i}>
            <div style={{ marginTop: 25 }}>
              <b>Behavior #{i + 1}:</b>
            </div>
            <BehaviorReferenceInspector artifact={_} taxonomy={taxonomy} />
          </div>
        ))}
    </>
  );
}
