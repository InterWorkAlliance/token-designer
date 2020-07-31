import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as uuid from "uuid";
import * as vscode from "vscode";
import * as protobufAny from "google-protobuf/google/protobuf/any_pb";

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
    const newArtifactSymbol = new ttfArtifact.ArtifactSymbol();
    newArtifactSymbol.setId(uuid.v1());
    newArtifactSymbol.setTooling("U");
    const newArtifact = new ttfArtifact.Artifact();
    newArtifact.setName("Untitled");
    newArtifact.setArtifactSymbol(newArtifactSymbol);
    const newBehaviorGroup = new ttfCore.BehaviorGroup();
    newBehaviorGroup.setArtifact(newArtifact);
    const any = new protobufAny.Any();
    any.pack(newBehaviorGroup.serializeBinary(), "taxonomy.model.core.BehaviorGroup");
    const newArtifactRequest = new ttfArtifact.NewArtifactRequest();
    newArtifactRequest.setArtifact(any);
    newArtifactRequest.setType(ttfArtifact.ArtifactType.BEHAVIOR_GROUP);
    await new Promise((resolve, reject) =>
      ttfConnection.createArtifact(newArtifactRequest, (err) =>
        err ? reject(err) : resolve()
      )
    );
    await ttfTaxonomy.refresh();
    await panel.openArtifact(newArtifactSymbol.getId());
    return panel;
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

  protected async onUnhandledMessage(message: any) {}

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
