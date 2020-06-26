import { taxonomy } from "./ttf/protobufs";
import * as vscode from "vscode";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { behaviorGroupPanelEvents } from "./panels/behaviorGroupPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class BehaviorGroupPanel extends ArtifactPanelBase<taxonomy.model.core.IBehaviorGroup> {
  static async openExistingBehaviorGroup(
    artifactId: string,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new BehaviorGroupPanel(
      ttfConnection,
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
    await panel.openArtifact(artifactId);
    return panel;
  }

  private constructor(
    private readonly ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    super(
      "Behavior Group",
      "behavior-group.svg",
      "behaviorGroupPanel",
      "behaviorGroupPanel.main.js",
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
  }

  protected async onMessage(message: any) {
    if (message.e === behaviorGroupPanelEvents.Init) {
      this.postCurrentState();
    }
  }

  protected async getArtifact(
    symbol: taxonomy.model.artifact.IArtifactSymbol
  ): Promise<taxonomy.model.core.IBehaviorGroup> {
    return await new Promise((resolve, reject) =>
      this.ttfConnection.getBehaviorGroupArtifact(
        symbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
  }
}
