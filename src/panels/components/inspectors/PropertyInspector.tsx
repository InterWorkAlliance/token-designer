import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import InvocationInspector from "./InvocationInspector";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact: taxonomy.model.core.IProperty;
};

export default function PropertyInspector({ taxonomy, artifact }: Props) {
  return (
    <div style={{ marginLeft: 25 }}>
      <p>
        <b>{artifact.name}</b>{" "}
        {!!artifact.templateValue && <> = {artifact.templateValue}</>}
        <br />
        <i>{artifact.valueDescription}</i>
      </p>
      {artifact.properties?.map((_) => (
        <PropertyInspector
          key={_.name || ""}
          taxonomy={taxonomy}
          artifact={_}
        />
      ))}
      {!!artifact.propertyInvocations?.length && (
        <>
          <p>
            <u>{artifact.name} invocations:</u>
          </p>
          {artifact.propertyInvocations.map((_) => (
            <InvocationInspector key={_.name + "-" + _.id} invocation={_} />
          ))}
        </>
      )}
    </div>
  );
}
