import * as vscode from "vscode";
import * as ttfTaxonomy from "./ttf/taxonomy_pb";

import { ITtfInterface } from "./ttfInterface";
import { TaxonomyAsObjects } from "./panels/taxonomyAsObjects";

export class TokenTaxonomy {
  private readonly onRefreshEmitter: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();

  public readonly onRefresh: vscode.Event<void> = this.onRefreshEmitter.event;

  private latestTaxonomy: ttfTaxonomy.Taxonomy | null = null;

  get taxonomy(): ttfTaxonomy.Taxonomy | null {
    return this.latestTaxonomy;
  }

  constructor(private readonly ttfConnection: ITtfInterface) {
    this.refresh();
  }

  public asObjects(): TaxonomyAsObjects | null {
    if (!this.taxonomy) {
      return null;
    }
    const taxonomyObject = this.taxonomy.toObject();
    return {
      baseTokenTypes: taxonomyObject.baseTokenTypesMap
        .map((_) => _[1])
        .sort(
          (a, b) => a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
        ),
      propertySets: taxonomyObject.propertySetsMap
        .map((_) => _[1])
        .sort(
          (a, b) => a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
        ),
      behaviors: taxonomyObject.behaviorsMap
        .map((_) => _[1])
        .sort(
          (a, b) => a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
        ),
      behaviorGroups: taxonomyObject.behaviorGroupsMap
        .map((_) => _[1])
        .sort(
          (a, b) => a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
        ),
    };
  }

  public async refresh() {
    const version = new ttfTaxonomy.TaxonomyVersion();
    version.setVersion("1.0");
    this.latestTaxonomy = await new Promise((resolve, reject) =>
      this.ttfConnection.getFullTaxonomy(version, (error, response) =>
        error ? reject(error) : resolve(response)
      )
    );
    this.onRefreshEmitter.fire();
  }

  public getArtifcactById(id?: string) {
    if (!id || !this.latestTaxonomy) {
      return undefined;
    }
    return (
      this.latestTaxonomy.getBaseTokenTypesMap().get(id) ||
      this.latestTaxonomy.getPropertySetsMap().get(id) ||
      this.latestTaxonomy.getBehaviorsMap().get(id) ||
      this.latestTaxonomy.getBehaviorGroupsMap().get(id)
    );
  }
}
