import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { behaviorGroupPanelEvents } from "./panels/behaviorGroupPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class BehaviorGroupPanel extends ArtifactPanelBase<ttfCore.BehaviorGroup> {
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
      environment,
      ttfTaxonomy,
      "Behavior Group",
      "behavior-group.svg",
      "behaviorGroupPanel",
      "behaviorGroupPanel.main.js",
      extensionPath,
      disposables,
      panelReloadEvent
    );
  }

  protected async onUnhandledMessage(message: any) {
  }

  protected async getArtifact(
    symbol: ttfArtifact.ArtifactSymbol
  ): Promise<ttfCore.BehaviorGroup> {
    return await new Promise((resolve, reject) =>
      this.ttfConnection.getBehaviorGroupArtifact(
        symbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
  }
}
