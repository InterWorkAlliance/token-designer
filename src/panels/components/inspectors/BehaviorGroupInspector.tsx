import React from "react";

import { BehaviorGroup } from "../../../ttf/core_pb";

import { TaxonomyAsObjects } from "../../taxonomyAsObjects";
import BehaviorReferenceInspector from "./BehaviorReferenceInspector";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: BehaviorGroup.AsObject;
};

export default function BehaviorGroupInspector({ taxonomy, artifact }: Props) {
  return (
    <>
      {!!artifact.behaviorsList.length &&
        artifact.behaviorsList.map((_, i) => (
          <>
            <div style={{ marginTop: 25 }}>
              <b>Behavior #{i + 1}:</b>
            </div>
            <BehaviorReferenceInspector artifact={_} taxonomy={taxonomy} />
          </>
        ))}
    </>
  );
}
