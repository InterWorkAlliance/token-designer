import React from "react";

import { Property } from "../../../ttf/core_pb";

import { TaxonomyAsObjects } from "../../taxonomyAsObjects";
import InvocationInspector from "./InvocationInspector";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: Property.AsObject;
  postMessage?: (message: any) => void;
};

export default function PropertyInspector({
  taxonomy,
  artifact,
  postMessage,
}: Props) {
  return (
    <div style={{ marginLeft: 25 }}>
      <p>
        <b>{artifact.name || (!!postMessage && <em>(name not set)</em>)}</b>{" "}
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
