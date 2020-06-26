import * as vscode from "vscode";
import { taxonomy } from "./ttf/protobufs";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { ITtfInterface } from "./ttfInterface";
import { propertySetPanelEvents } from "./panels/propertySetPanelEvents";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class PropertySetPanel extends ArtifactPanelBase<
  taxonomy.model.core.IPropertySet
> {
  static async openExistingPropertySet(
    artifactId: string,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new PropertySetPanel(
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
      "Property Set",
      "property-set.svg",
      "propertySetPanel",
      "propertySetPanel.main.js",
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
  }

  protected async onMessage(message: any) {
    if (message.e === propertySetPanelEvents.Init) {
      this.postCurrentState();
    }
  }

  protected async getArtifact(
    symbol: taxonomy.model.artifact.IArtifactSymbol
  ): Promise<taxonomy.model.core.IPropertySet> {
    return await new Promise((resolve, reject) =>
      this.ttfConnection.getPropertySetArtifact(
        symbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
  }
}
