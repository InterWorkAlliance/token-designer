import React from "react";

import { IArtifactAsObject } from "../../ttfInterface";

type Props = {
  id?: string;
  tooling?: string;
  getArtifactById: (
    id: string,
    tooling?: string
  ) => IArtifactAsObject | undefined;
};

export default function ArtifactReference({
  id,
  tooling,
  getArtifactById,
}: Props) {
  const artifact = id ? getArtifactById(id, tooling) : undefined;
  return <>{artifact?.name || tooling || ""}</>;
}
