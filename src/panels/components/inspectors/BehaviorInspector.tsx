import React, { useState } from "react";

import { Behavior } from "../../../ttf/core_pb";

import AddLink from "../links/AddLink";
import { behaviorPanelEvents } from "../../behaviorPanelEvents";
import EditLink from "../links/EditLink";
import InvocationEditor from "../editors/InvocationEditor";
import InvocationInspector from "./InvocationInspector";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: Behavior.AsObject;
  postMessage?: (message: any) => void;
};

export default function BehaviorInspector({
  taxonomy,
  artifact,
  postMessage,
}: Props) {
  const [addInvocationMode, setAddInvocationMode] = useState(false);
  return (
    <>
      {(!!postMessage || !!artifact.constructorType) && (
        <div>
          <u>Constructor:</u>
          <ul>
            <li>
              <b>{artifact.constructorType}</b>{" "}
              {!!postMessage && (
                <EditLink
                  onClick={() =>
                    postMessage({ e: behaviorPanelEvents.EditConstructorType })
                  }
                />
              )}
            </li>
          </ul>
        </div>
      )}
      {!!artifact.propertiesList.length && (
        <div>
          <u>Properties:</u>
          <ul>
            {artifact.propertiesList.map((_) => (
              <li key={JSON.stringify(_)}>
                <b>{_.name}:</b>
                {!!(_.templateValue || _.valueDescription) && (
                  <>
                    {" "}
                    {_.templateValue}
                    <br />
                    {_.valueDescription}
                    <br />
                    <br />
                  </>
                )}
                {!!_.propertyInvocationsList.length && (
                  <ul>
                    {_.propertyInvocationsList.map((_) => (
                      <li key={_.id}>
                        <InvocationInspector invocation={_} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!artifact.invocationsList.length && (
        <div>
          <u>Invocations:</u>{" "}
          {!!postMessage && (
            <AddLink onClick={() => setAddInvocationMode(true)} />
          )}
          {!!postMessage && addInvocationMode && (
            <InvocationEditor
              hide={() => setAddInvocationMode(false)}
              onSave={(invocation) => {
                postMessage({
                  e: behaviorPanelEvents.EditInvocation,
                  i: artifact.invocationsList.length,
                  invocation,
                });
              }}
            />
          )}
          <ul>
            {artifact.invocationsList.map((_, i) => (
              <li key={i}>
                <InvocationInspector
                  invocation={_}
                  onSave={
                    !!postMessage
                      ? (invocation) => {
                          postMessage({
                            e: behaviorPanelEvents.EditInvocation,
                            i,
                            invocation,
                          });
                        }
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
