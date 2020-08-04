import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { behaviorGroupPanelEvents } from "./panels/behaviorGroupPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class BehaviorGroupPanel extends ArtifactPanelBase<
  ttfCore.BehaviorGroup
> {
  static async createNewBehaviorGroup(
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
    return await ArtifactPanelBase.createNew(
      ttfConnection,
      ttfTaxonomy,
      panel,
      new ttfCore.BehaviorGroup(),
      "taxonomy.model.core.BehaviorGroup",
      ttfArtifact.ArtifactType.BEHAVIOR_GROUP
    );
  }

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
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    super(
      ttfConnection,
      "taxonomy.model.core.BehaviorGroup",
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
    if (message.e === behaviorGroupPanelEvents.Add) {
      const newReference = await this.promptForBehaviorReference();
      if (newReference) {
        this.artifact?.addBehaviors(newReference);
        await this.saveChanges();
      }
    } else if (message.e === behaviorGroupPanelEvents.Delete) {
      this.artifact?.setBehaviorsList(
        this.artifact?.getBehaviorsList().filter((_, i) => i !== message.i)
      );
      await this.saveChanges();
    }
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

  private async promptForBehaviorReference() {
    const quickPickItems = this.ttfTaxonomy
      .asObjects()
      ?.behaviors.filter(
        (_) =>
          !!_.artifact &&
          !!_.artifact.artifactSymbol &&
          !!_.artifact.artifactSymbol.id
      )
      .map(
        (_) =>
          ({
            symbol: _.artifact?.artifactSymbol,
            label: _.artifact?.name || "",
            description: _.artifact?.artifactSymbol?.id,
            detail: _.artifact?.artifactDefinition?.businessDescription,
          } as vscode.QuickPickItem & {
            symbol: ttfArtifact.ArtifactSymbol.AsObject;
          })
      );
    if (!quickPickItems) {
      return undefined;
    }
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = quickPickItems;
    quickPick.canSelectMany = false;
    const item = await new Promise<
      | (vscode.QuickPickItem & {
          symbol: ttfArtifact.ArtifactSymbol.AsObject;
        })
      | undefined
    >((resolve) => {
      quickPick.onDidAccept(() => {
        const item = quickPick.selectedItems[0];
        resolve(
          item as vscode.QuickPickItem & {
            symbol: ttfArtifact.ArtifactSymbol.AsObject;
          }
        );
        quickPick.hide();
      });
      quickPick.onDidHide((_) => resolve(undefined));
      quickPick.show();
    });
    if (!item?.symbol) {
      return;
    }
    const reference = new ttfArtifact.ArtifactReference();
    reference.setId(item.symbol.id);
    reference.setType(ttfArtifact.ArtifactType.BEHAVIOR);
    const result = new ttfCore.BehaviorReference();
    result.setReference(reference);
    return result;
  }
}
