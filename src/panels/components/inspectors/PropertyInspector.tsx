import React from "react";

import { Property } from "../../../ttf/core_pb";

import DeleteLink from "../links/DeleteLink";
import EditLink from "../links/EditLink";
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
        <br />
        <i>
          {artifact.valueDescription ||
            (!!postMessage && <>(description not set)</>)}
        </i>
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
      {!!artifact.propertyInvocationsList.length && (
        <>
          <p>
            <u>{artifact.name} invocations:</u>
          </p>
          {artifact.propertyInvocationsList.map((_) => (
            <InvocationInspector key={_.name + "-" + _.id} invocation={_} />
          ))}
        </>
      )}
    </div>
  );
}
