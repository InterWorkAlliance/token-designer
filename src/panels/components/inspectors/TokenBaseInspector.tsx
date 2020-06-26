import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

type Props = {
  artifact: taxonomy.model.core.IBase;
};

export default function TokenBaseInspector({ artifact }: Props) {
  return (
    <>
      <div>
        <u>Token type:</u>
        <ul>
          <li>{artifact.tokenType || "Unknown"}</li>
        </ul>
      </div>
      <div>
        <u>Token unit:</u>
        <ul>
          <li>{artifact.tokenUnit || "Unknown"}</li>
        </ul>
      </div>
      <div>
        <u>Representation type:</u>
        <ul>
          <li>{artifact.representationType || "Unknown"}</li>
        </ul>
      </div>
      <div>
        <u>Value type:</u>
        <ul>
          <li>{artifact.valueType || "Unknown"}</li>
        </ul>
      </div>
      <div>
        <u>Supply:</u>
        <ul>
          <li>{artifact.supply || "Unknown"}</li>
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
