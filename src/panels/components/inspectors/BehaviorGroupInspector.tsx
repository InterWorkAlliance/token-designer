import React from "react";

import { BehaviorGroup } from "../../../ttf/core_pb";

import AddLink from "../links/AddLink";
import { behaviorGroupPanelEvents } from "../../behaviorGroupPanelEvents";
import BehaviorReferenceInspector from "./BehaviorReferenceInspector";
import DeleteLink from "../links/DeleteLink";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: BehaviorGroup.AsObject;
  postMessage?: (message: any) => void;
};

export default function BehaviorGroupInspector({
  taxonomy,
  artifact,
  postMessage,
}: Props) {
  return (
    <>
      {!!artifact.behaviorsList.length &&
        artifact.behaviorsList.map((_, i) => (
          <div key={i}>
            <div style={{ marginTop: 25 }}>
              <b>Behavior #{i + 1}:</b>{" "}
              {!!postMessage && (
                <DeleteLink
                  onClick={() =>
                    postMessage({ e: behaviorGroupPanelEvents.Delete, i })
                  }
                />
              )}
            </div>
            <BehaviorReferenceInspector artifact={_} taxonomy={taxonomy} />
          </div>
        ))}
      {!!postMessage && (
        <div>
          <b>Behavior #{artifact.behaviorsList.length + 1}:</b>{" "}
          <AddLink
            onClick={() => postMessage({ e: behaviorGroupPanelEvents.Add })}
          />
        </div>
      )}
    </>
  );
}
