import React from "react";

import { Base } from "../../ttf/core_pb";

import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: Base.AsObject;
};

export default function TokenBaseInspector({ taxonomy, artifact }: Props) {
  return (
    <>
      <div>
        <u>Token type:</u>
        <ul>
          <li>
            {["Fungible", "Non-fungible"][artifact.tokenType] || "Unknown"}
          </li>
        </ul>
      </div>
      <div>
        <u>Token unit:</u>
        <ul>
          <li>
            {["Fractional", "Whole", "Singleton"][artifact.tokenUnit] || "Unknown"}
          </li>
        </ul>
      </div>
      <div>
        <u>Representation type:</u>
        <ul>
          <li>
            {["Common", "Unique"][artifact.representationType] || "Unknown"}
          </li>
        </ul>
      </div>
      <div>
        <u>Value type:</u>
        <ul>
          <li>
            {["Intrinsic", "Reference"][artifact.valueType] || "Unknown"}
          </li>
        </ul>
      </div>
      <div>
        <u>Supply:</u>
        <ul>
          <li>
            {["Fixed", "Capped-variable", "Gated", "Infinite"][
              artifact.supply
            ] || "Unknown"}
          </li>
        </ul>
      </div>
      <div>
        <u>Quantity:</u>
        <ul>
          <li>{artifact.quantity}</li>
        </ul>
      </div>
      <div>
        <u>Decimals:</u>
        <ul>
          <li>{artifact.quantity}</li>
        </ul>
      </div>
    </>
  );
}
