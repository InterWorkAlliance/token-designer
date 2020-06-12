import React from "react";

import { PropertySet } from "../../ttf/core_pb";

import { TaxonomyAsObjects } from "../taxonomyAsObjects";
import PropertyInspector from "./PropertyInspector";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: PropertySet.AsObject;
};

export default function PropertySetInspector({ taxonomy, artifact }: Props) {
  return (
    <>
      {!!artifact.propertiesList.length && (
        <>
          <p>
            <u>Properties</u>
          </p>
          {artifact.propertiesList.map((_) => (
            <PropertyInspector key={_.name} taxonomy={taxonomy} artifact={_} />
          ))}
        </>
      )}
    </>
  );
}
