import React from "react";

import { Property } from "../../ttf/core_pb";

import { TaxonomyAsObjects } from "../taxonomyAsObjects";
import InvocationInspector from "./InvocationInspector";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: Property.AsObject;
};

export default function PropertyInspector({ taxonomy, artifact }: Props) {
  return (
    <div style={{ marginLeft: 25 }}>
      <p>
        <b>{artifact.name}</b>
        <br />
        <i>{artifact.valueDescription}</i>
      </p>
      {artifact.propertiesList.map((_) => (
        <PropertyInspector key={_.name} taxonomy={taxonomy} artifact={_} />
      ))}
      {!!artifact.propertyInvocationsList.length && (
        <>
          <p>
            <u>{artifact.name} invocations:</u>
          </p>
          {artifact.propertyInvocationsList.map((_) => (
            <InvocationInspector key={_.id} invocation={_} />
          ))}
        </>
      )}
    </div>
  );
}
