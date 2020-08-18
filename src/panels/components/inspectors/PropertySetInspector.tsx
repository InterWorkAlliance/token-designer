import React from "react";

import { PropertySet } from "../../../ttf/core_pb";

import AddLink from "../links/AddLink";
import PropertyInspector from "./PropertyInspector";
import { propertySetPanelEvents } from "../../propertySetPanelEvents";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: PropertySet.AsObject;
  postMessage?: (message: any) => void;
};

export default function PropertySetInspector({
  taxonomy,
  artifact,
  postMessage,
}: Props) {
  return (
    <>
      <p>
        <u>Representation Type:</u>
        <ul>
          <li>
            {["Common", "Unique"][artifact.representationType] || "Unknown"}
          </li>
        </ul>
      </p>
      {(!!postMessage || !!artifact.propertiesList.length) && (
        <>
          <p>
            <u>Properties:</u>{" "}
            {!!postMessage && (
              <AddLink
                onClick={() =>
                  postMessage({
                    e: propertySetPanelEvents.AddProperty,
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
              path={[_.name]}
              postMessage={postMessage}
            />
          ))}
        </>
      )}
    </>
  );
}
