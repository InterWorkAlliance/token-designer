import React from "react";

import { getArtifactById } from "../getArtifactById";
import { taxonomy } from "../../ttf/protobufs";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  id?: string | null;
  tooling?: string | null;
};

export default function ArtifactReference({ taxonomy, id, tooling }: Props) {
  const artifact = id
    ? getArtifactById(taxonomy, id, tooling)?.artifact
    : undefined;
  return <>{artifact?.name || tooling || ""}</>;
}
