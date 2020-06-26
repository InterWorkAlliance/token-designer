import { taxonomy } from "./ttf/protobufs";
import * as vscode from "vscode";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { ITtfInterface } from "./ttfInterface";
import { tokenBasePanelEvents } from "./panels/tokenBasePanelEvents";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class TokenBasePanel extends ArtifactPanelBase<taxonomy.model.core.IBase> {
  static async openExistingTokenBase(
    artifactId: string,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new TokenBasePanel(
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
      "Token Base",
      "token-base.svg",
      "tokenBasePanel",
      "tokenBasePanel.main.js",
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
  }

  protected async onMessage(message: any) {
    if (message.e === tokenBasePanelEvents.Init) {
      this.postCurrentState();
    }
  }

  protected async getArtifact(
    symbol: taxonomy.model.artifact.IArtifactSymbol
  ): Promise<taxonomy.model.core.IBase> {
    return await new Promise((resolve, reject) =>
      this.ttfConnection.getBaseArtifact(
        symbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
  }
}
