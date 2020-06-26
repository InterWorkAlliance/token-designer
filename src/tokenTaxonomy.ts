import * as vscode from "vscode";
import { taxonomy } from "./ttf/protobufs";

import { ITtfInterface } from "./ttfInterface";

export class TokenTaxonomy {
  private readonly onRefreshEmitter: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();

  public readonly onRefresh: vscode.Event<void> = this.onRefreshEmitter.event;

  private latestTaxonomy: taxonomy.model.ITaxonomy | null = null;

  get taxonomy(): taxonomy.model.ITaxonomy | null {
    return this.latestTaxonomy;
  }

  constructor(private readonly ttfConnection: ITtfInterface) {
    this.refresh();
  }

  public async refresh() {
    const version = new taxonomy.model.TaxonomyVersion();
    version.version = "1.0";
    this.latestTaxonomy = await new Promise((resolve, reject) =>
      this.ttfConnection.getFullTaxonomy(version, (error, response) =>
        error ? reject(error) : resolve(response)
      )
    );
    this.onRefreshEmitter.fire();
  }

  public getArtifcactById(
    id?: string | null
  ):
    | taxonomy.model.core.IBase
    | taxonomy.model.core.IPropertySet
    | taxonomy.model.core.IBehavior
    | taxonomy.model.core.IBehaviorGroup
    | undefined {
    if (!id || !this.latestTaxonomy) {
      return undefined;
    }
    return (
      (this.latestTaxonomy.baseTokenTypes || {})[id] ||
      (this.latestTaxonomy.propertySets || {})[id] ||
      (this.latestTaxonomy.behaviors || {})[id] ||
      (this.latestTaxonomy.behaviorGroups || {})[id]
    );
  }
}
