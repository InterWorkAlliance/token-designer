import React from "react";

import { Artifact } from "../../ttf/artifact_pb";

type Props = {
  id?: string;
  tooling?: string;
  getArtifactById: (
    id: string,
    tooling?: string
  ) => Artifact.AsObject | undefined;
};

export default function ArtifactReference({
  id,
  tooling,
  getArtifactById,
}: Props) {
  const artifact = id ? getArtifactById(id, tooling) : undefined;
  return <>{artifact?.name || tooling || ""}</>;
}
