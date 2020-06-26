import AnyArtifact from "./components/AnyArtifact";

import { taxonomy } from "../ttf/protobufs";

export function getArtifactByTooling(
  taxonomy: taxonomy.model.ITaxonomy,
  tooling: string
): AnyArtifact | undefined {
  let result: AnyArtifact | undefined = (taxonomy?.baseTokenTypes || {})[
    tooling
  ];
  if (!result) {
    result = (taxonomy?.propertySets || {})[tooling];
    if (!result) {
      result = (taxonomy?.behaviors || {})[tooling];
      if (!result) {
        result = (taxonomy?.behaviorGroups || {})[tooling];
      }
    }
  }
  return result;
}

export function getArtifactById(
  taxonomy: taxonomy.model.ITaxonomy,
  id?: string | null,
  tooling?: string | null
): AnyArtifact | undefined {
  let result: AnyArtifact | undefined = (taxonomy?.baseTokenTypes || {})[
    id || ""
  ];
  if (!result) {
    result = (taxonomy?.propertySets || {})[id || ""];
    if (!result) {
      result = (taxonomy?.behaviors || {})[id || ""];
      if (!result) {
        result = (taxonomy?.behaviorGroups || {})[id || ""];
      }
    }
  }
  if (result) {
    return result;
  } else if (tooling) {
    return getArtifactByTooling(taxonomy, tooling);
  }
}
