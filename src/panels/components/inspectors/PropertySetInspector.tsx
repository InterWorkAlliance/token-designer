import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import PropertyInspector from "./PropertyInspector";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact: taxonomy.model.core.IPropertySet;
};

export default function PropertySetInspector({ taxonomy, artifact }: Props) {
  return (
    <>
      {!!artifact.properties?.length && (
        <>
          <p>
            <u>Properties</u>
          </p>
          {artifact.properties.map((_) => (
            <PropertyInspector
              key={_.name || ""}
              taxonomy={taxonomy}
              artifact={_}
            />
          ))}
        </>
      )}
    </>
  );
}
