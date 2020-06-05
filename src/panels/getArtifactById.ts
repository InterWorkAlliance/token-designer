import * as ttfArtifact from "../ttf/artifact_pb";

import { TaxonomyAsObjects } from "./taxonomyAsObjects";

export function getArtifactByTooling(
  taxonomy: TaxonomyAsObjects,
  tooling: string
): ttfArtifact.Artifact.AsObject | undefined {
  let result:
    | ttfArtifact.Artifact.AsObject
    | undefined = taxonomy?.baseTokenTypes.find(
    (_) => _.artifact?.artifactSymbol?.tooling === tooling
  )?.artifact;
  if (!result) {
    result = taxonomy?.propertySets.find(
      (_) => _.artifact?.artifactSymbol?.tooling === tooling
    )?.artifact;
    if (!result) {
      result = taxonomy?.behaviors.find(
        (_) => _.artifact?.artifactSymbol?.tooling === tooling
      )?.artifact;
      if (!result) {
        result = taxonomy?.behaviorGroups.find(
          (_) => _.artifact?.artifactSymbol?.tooling === tooling
        )?.artifact;
      }
    }
  }
  return result;
}

export function getArtifactById(
  taxonomy: TaxonomyAsObjects,
  id: string,
  tooling?: string
): ttfArtifact.Artifact.AsObject | undefined {
  let result:
    | ttfArtifact.Artifact.AsObject
    | undefined = taxonomy?.baseTokenTypes.find(
    (_) => _.artifact?.artifactSymbol?.id === id
  )?.artifact;
  if (!result) {
    result = taxonomy?.propertySets.find(
      (_) => _.artifact?.artifactSymbol?.id === id
    )?.artifact;
    if (!result) {
      result = taxonomy?.behaviors.find(
        (_) => _.artifact?.artifactSymbol?.id === id
      )?.artifact;
      if (!result) {
        result = taxonomy?.behaviorGroups.find(
          (_) => _.artifact?.artifactSymbol?.id === id
        )?.artifact;
      }
    }
  }
  if (result) {
    return result;
  } else if (tooling) {
    return getArtifactByTooling(taxonomy, tooling);
  }
}
