import React, { useState } from "react";

import { Property } from "../../../ttf/core_pb";

import AddLink from "../links/AddLink";
import DeleteLink from "../links/DeleteLink";
import EditLink from "../links/EditLink";
import InvocationEditor from "../editors/InvocationEditor";
import InvocationInspector from "./InvocationInspector";
import { propertySetPanelEvents } from "../../propertySetPanelEvents";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: Property.AsObject;
  path: string[];
  postMessage?: (message: any) => void;
};

export default function PropertyInspector({
  taxonomy,
  artifact,
  path,
  postMessage,
}: Props) {
  const [addInvocationMode, setAddInvocationMode] = useState(false);
  return (
    <div style={{ marginLeft: 25 }}>
      <p>
        <b>{artifact.name || (!!postMessage && <em>(name not set)</em>)}</b>{" "}
        {!!postMessage && (
          <>
            <EditLink
              onClick={() =>
                postMessage({
                  e: propertySetPanelEvents.EditPropertyName,
                  path,
                })
              }
            />
            <DeleteLink
              onClick={() =>
                postMessage({
                  e: propertySetPanelEvents.DeleteProperty,
                  path,
                })
              }
            />
          </>
        )}
        {!!artifact.templateValue && <> = {artifact.templateValue}</>}
        {!!postMessage && !artifact.templateValue && (
          <> = (template value not set)</>
        )}
        {!!postMessage && (
          <EditLink
            onClick={() =>
              postMessage({
                e: propertySetPanelEvents.EditPropertyValue,
                path,
              })
            }
          />
        )}
        <br />
        <i>
          {artifact.valueDescription ||
            (!!postMessage && <>(description not set)</>)}
        </i>
        {artifact.repeated && <strong>Repeated.</strong>}
        {!!postMessage && (
          <EditLink
            onClick={() =>
              postMessage({
                e: propertySetPanelEvents.EditPropertyDescription,
                path,
              })
            }
          />
        )}
      </p>
      {!!artifact.influenceBindingsList.length && (
        <p>
          <u>Influence bindings:</u>
          <ul>
            {/* TODO: Improve display of influence bindings */}
            {artifact.influenceBindingsList.map((_) => (
              <li key={_.influencedId}>{JSON.stringify(_)}</li>
            ))}
          </ul>
        </p>
      )}
      {(!!postMessage || !!artifact.propertiesList.length) && (
        <>
          <p style={{ marginLeft: 25 }}>
            <u>{path.join(".")} sub-properties:</u>{" "}
            {!!postMessage && (
              <AddLink
                onClick={() =>
                  postMessage({
                    e: propertySetPanelEvents.AddProperty,
                    path,
                  })
                }
              />
            )}
          </p>
          {artifact.propertiesList.map((_) => (
            <PropertyInspector
              key={_.name}
              taxonomy={taxonomy}
              artifact={_}
              path={[...path, _.name]}
              postMessage={postMessage}
            />
          ))}
        </>
      )}
      {(!!postMessage || !!artifact.propertyInvocationsList.length) && (
        <>
          <p style={{ marginLeft: 25 }}>
            <u>{path.join(".")} invocations:</u>{" "}
            {!!postMessage && (
              <AddLink onClick={() => setAddInvocationMode(true)} />
            )}
            {!!postMessage && addInvocationMode && (
              <InvocationEditor
                hide={() => setAddInvocationMode(false)}
                onSave={(invocation) => {
                  postMessage({
                    e: propertySetPanelEvents.EditInvocation,
                    path,
                    i: artifact.propertyInvocationsList.length,
                    invocation,
                  });
                }}
              />
            )}
          </p>
          <p style={{ marginLeft: 25 }}>
            {artifact.propertyInvocationsList.map((_, i) => (
              <InvocationInspector
                key={_.name + "-" + _.id}
                invocation={_}
                onDelete={
                  !!postMessage
                    ? () => {
                        postMessage({
                          e: propertySetPanelEvents.DeleteInvocation,
                          path,
                          i,
                        });
                      }
                    : undefined
                }
                onSave={
                  !!postMessage
                    ? (invocation) => {
                        postMessage({
                          e: propertySetPanelEvents.EditInvocation,
                          path,
                          i,
                          invocation,
                        });
                      }
                    : undefined
                }
              />
            ))}
          </p>
        </>
      )}
    </div>
  );
}
