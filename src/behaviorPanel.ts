import { taxonomy } from "./ttf/protobufs";
import * as vscode from "vscode";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { behaviorPanelEvents } from "./panels/behaviorPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class BehaviorPanel extends ArtifactPanelBase<taxonomy.model.core.IBehavior> {
  static async openExistingBehavior(
    artifactId: string,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new BehaviorPanel(
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
      "Behavior",
      "behavior.svg",
      "behaviorPanel",
      "behaviorPanel.main.js",
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
  }

  protected async onMessage(message: any) {
    if (message.e === behaviorPanelEvents.Init) {
      this.postCurrentState();
    }
  }

  protected async getArtifact(
    symbol: taxonomy.model.artifact.IArtifactSymbol
  ): Promise<taxonomy.model.core.IBehavior> {
    return await new Promise((resolve, reject) =>
      this.ttfConnection.getBehaviorArtifact(
        symbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
  }
}
