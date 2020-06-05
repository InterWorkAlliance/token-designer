import React from "react";

import { getArtifactById } from "../getArtifactById";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  id?: string;
  tooling?: string;
};

export default function ArtifactReference({ taxonomy, id, tooling }: Props) {
  const artifact = id ? getArtifactById(taxonomy, id, tooling) : undefined;
  return <>{artifact?.name || tooling || ""}</>;
}
