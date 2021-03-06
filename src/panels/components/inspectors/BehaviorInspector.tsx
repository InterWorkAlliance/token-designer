import React, { useState } from "react";

import { Behavior } from "../../../ttf/core_pb";

import AddLink from "../links/AddLink";
import { behaviorPanelEvents } from "../../behaviorPanelEvents";
import DeleteLink from "../links/DeleteLink";
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
  const [addPropertyInvocationMode, setAddPropertyInvocationMode] = useState(
    false
  );
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
      {(!!postMessage || !!artifact.propertiesList.length) && (
        <div>
          <u>Properties:</u>{" "}
          {!!postMessage && (
            <AddLink
              onClick={() =>
                postMessage({
                  e: behaviorPanelEvents.AddProperty,
                })
              }
            />
          )}
          <ul>
            {artifact.propertiesList.map((_, pi) => (
              <li key={JSON.stringify(_)}>
                <b>{_.name || (!!postMessage && <em>(name not set)</em>)}</b>
                {!!postMessage && (
                  <>
                    <EditLink
                      onClick={() =>
                        postMessage({
                          e: behaviorPanelEvents.EditPropertyName,
                          pi,
                        })
                      }
                    />
                    <DeleteLink
                      onClick={() =>
                        postMessage({
                          e: behaviorPanelEvents.DeleteProperty,
                          pi,
                        })
                      }
                    />
                  </>
                )}
                <b>:</b>
                {!!(!!postMessage || _.templateValue || _.valueDescription) && (
                  <>
                    {" "}
                    {_.templateValue ||
                      (!!postMessage && <em>(template value not set)</em>)}
                    {!!postMessage && (
                      <EditLink
                        onClick={() =>
                          postMessage({
                            e: behaviorPanelEvents.EditPropertyValue,
                            pi,
                          })
                        }
                      />
                    )}
                    <br />
                    {_.valueDescription ||
                      (!!postMessage && <em>(description not set)</em>)}
                    {!!postMessage && (
                      <EditLink
                        onClick={() =>
                          postMessage({
                            e: behaviorPanelEvents.EditPropertyDescription,
                            pi,
                          })
                        }
                      />
                    )}
                    <br />
                  </>
                )}
                {(!!_.propertyInvocationsList.length || !!postMessage) && (
                  <>
                    <u>Invocations:</u>{" "}
                    {!!postMessage && (
                      <AddLink
                        onClick={() => setAddPropertyInvocationMode(true)}
                      />
                    )}
                    {!!postMessage && addPropertyInvocationMode && (
                      <InvocationEditor
                        hide={() => setAddPropertyInvocationMode(false)}
                        onSave={(invocation) => {
                          postMessage({
                            e: behaviorPanelEvents.EditPropertyInvocation,
                            pi,
                            i: _.propertyInvocationsList.length,
                            invocation,
                          });
                        }}
                      />
                    )}
                    <ul>
                      {_.propertyInvocationsList.map((_, i) => (
                        <li key={_.id}>
                          <InvocationInspector
                            invocation={_}
                            onDelete={
                              !!postMessage
                                ? () => {
                                    postMessage({
                                      e:
                                        behaviorPanelEvents.DeletePropertyInvocation,
                                      pi,
                                      i,
                                    });
                                  }
                                : undefined
                            }
                            onSave={
                              !!postMessage
                                ? (invocation) => {
                                    postMessage({
                                      e:
                                        behaviorPanelEvents.EditPropertyInvocation,
                                      pi,
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
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(!!postMessage || !!artifact.invocationsList.length) && (
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
                  onDelete={
                    !!postMessage
                      ? () => {
                          postMessage({
                            e: behaviorPanelEvents.DeleteInvocation,
                            i,
                          });
                        }
                      : undefined
                  }
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
