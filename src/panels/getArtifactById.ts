import AnyArtifact from "./components/AnyArtifact";
import { TaxonomyAsObjects } from "./taxonomyAsObjects";

export function getArtifactByTooling(
  taxonomy: TaxonomyAsObjects,
  tooling: string
): AnyArtifact | undefined {
  let result:
    | AnyArtifact
    | undefined = taxonomy?.baseTokenTypes.find(
    (_) => _.artifact?.artifactSymbol?.tooling === tooling
  );
  if (!result) {
    result = taxonomy?.propertySets.find(
      (_) => _.artifact?.artifactSymbol?.tooling === tooling
    );
    if (!result) {
      result = taxonomy?.behaviors.find(
        (_) => _.artifact?.artifactSymbol?.tooling === tooling
      );
      if (!result) {
        result = taxonomy?.behaviorGroups.find(
          (_) => _.artifact?.artifactSymbol?.tooling === tooling
        );
      }
    }
  }
  return result;
}

export function getArtifactById(
  taxonomy: TaxonomyAsObjects,
  id: string,
  tooling?: string
): AnyArtifact | undefined {
  let result:
    | AnyArtifact
    | undefined = taxonomy?.baseTokenTypes.find(
    (_) => _.artifact?.artifactSymbol?.id === id
  );
  if (!result) {
    result = taxonomy?.propertySets.find(
      (_) => _.artifact?.artifactSymbol?.id === id
    );
    if (!result) {
      result = taxonomy?.behaviors.find(
        (_) => _.artifact?.artifactSymbol?.id === id
      );
      if (!result) {
        result = taxonomy?.behaviorGroups.find(
          (_) => _.artifact?.artifactSymbol?.id === id
        );
      }
    }
  }
  if (result) {
    return result;
  } else if (tooling) {
    return getArtifactByTooling(taxonomy, tooling);
  }
}
