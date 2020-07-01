import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";
import * as protobufAny from "google-protobuf/google/protobuf/any_pb";

import { definitionPanelEvents } from "./panels/definitionPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { PanelBase } from "./panelBase";
import { TaxonomyAsObjects } from "./panels/taxonomyAsObjects";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class DefinitionPanel extends PanelBase {

  private taxonomyObjects: TaxonomyAsObjects | null = null;

  private definition: ttfCore.TemplateDefinition | null = null;

  static async openNewDefinition(
    formulaId: any,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    let definitionName = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      prompt: "Choose a name for the definition",
      validateInput: (_) => (_ && _.length ? "" : "The name cannot be empty"),
    });
    if (definitionName) {
      const panel = new DefinitionPanel(
        ttfConnection,
        environment,
        ttfTaxonomy,
        extensionPath,
        disposables,
        panelReloadEvent
      );
      panel.newDefinition(formulaId, definitionName);
      return panel;
    }
  }

  static async openExistingDefinition(
    artifactId: string,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new DefinitionPanel(
      ttfConnection,
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
    await panel.openDefinition(artifactId);
    return panel;
  }

  private constructor(
    private readonly ttfConnection: ITtfInterface,
    private readonly environment: string,
    private readonly ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    super(
      "definitionPanel",
      "definitionPanel.main.js",
      extensionPath,
      disposables,
      panelReloadEvent
    );
    this.setTitle(this.title(), "token-base.svg");
    this.refreshTaxonomy();
    this.ttfTaxonomy.onRefresh(this.refreshTaxonomy, this);
  }

  async onMessage(message: any) {
    if (message.e === definitionPanelEvents.Init) {
      this.postMessage({
        definition: this.definition?.toObject(),
        taxonomy: this.taxonomyObjects,
      });
    } else if (message.e === definitionPanelEvents.SetDefinitionName) {
      await this.setDefinitionName(message.name);
    }
  }

  private title() {
    const suffix = " - " + this.environment;
    if (this.definition) {
      return (
        (this.definition.getArtifact()?.getName() || "New definition") +
        " - Token Definition" +
        suffix
      );
    } else {
      return "Token Designer" + suffix;
    }
  }

  private async newDefinition(formulaId: any, name: string) {
    const newTemplateDefinition = new ttfArtifact.NewTemplateDefinition();
    newTemplateDefinition.setTemplateFormulaId(formulaId);
    newTemplateDefinition.setTokenName(name);
    const result: ttfCore.TemplateDefinition = await new Promise(
      (resolve, reject) =>
        this.ttfConnection.createTemplateDefinition(
          newTemplateDefinition,
          (error, response) => (error && reject(error)) || resolve(response)
        )
    );
    const newDefinitionId: string =
      result.getArtifact()?.getArtifactSymbol()?.getId() || "";
    this.refreshDefinition(newDefinitionId);
  }

  private async openDefinition(artifactId: string) {
    this.refreshDefinition(artifactId);
  }

  private packTemplateDefinition(definition: ttfCore.TemplateDefinition) {
    const any = new protobufAny.Any();
    any.pack(
      definition.serializeBinary(),
      "taxonomy.model.core.TemplateDefinition"
    );
    return any;
  }

  private async refreshDefinition(artifactId?: string) {
    artifactId =
      artifactId ||
      this.definition?.getArtifact()?.getArtifactSymbol()?.getId();
    if (artifactId) {
      const existingArtifactSymbol = new ttfArtifact.ArtifactSymbol();
      existingArtifactSymbol.setId(artifactId);
      this.definition = await new Promise((resolve, reject) =>
        this.ttfConnection.getTemplateDefinitionArtifact(
          existingArtifactSymbol,
          (error, response) => (error && reject(error)) || resolve(response)
        )
      );
    } else {
      this.definition = null;
    }
    this.postMessage({
      definition: this.definition?.toObject(),
      formula: null,
    });
    this.setTitle(this.title());
    await this.ttfTaxonomy.refresh();
  }

  private async refreshTaxonomy() {
    this.taxonomyObjects = this.ttfTaxonomy.asObjects();
    this.postMessage({ taxonomy: this.taxonomyObjects });
  }

  private async saveDefintion(deleteAndRecreate: boolean = false) {
    if (this.definition) {
      if (deleteAndRecreate) {
        // Saving and deleting (instead of updating) allows for artifact names
        // to be changed and prevents the gRPC server from creating version
        // subfolders.
        const deleteSymbol = new ttfArtifact.ArtifactSymbol();
        deleteSymbol.setType(ttfArtifact.ArtifactType.TEMPLATE_DEFINITION);
        deleteSymbol.setTooling(
          this.definition?.getArtifact()?.getArtifactSymbol()?.getTooling() ||
            ""
        );
        const deleteRequest = new ttfArtifact.DeleteArtifactRequest();
        deleteRequest.setArtifactSymbol(deleteSymbol);
        await new Promise((resolve, reject) =>
          this.ttfConnection.deleteArtifact(
            deleteRequest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
        const newArtifactRequest = new ttfArtifact.NewArtifactRequest();
        newArtifactRequest.setType(
          ttfArtifact.ArtifactType.TEMPLATE_DEFINITION
        );
        newArtifactRequest.setArtifact(
          this.packTemplateDefinition(this.definition)
        );
        await new Promise((resolve, reject) =>
          this.ttfConnection.createArtifact(
            newArtifactRequest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
      } else {
        const updateReqest = new ttfArtifact.UpdateArtifactRequest();
        updateReqest.setType(ttfArtifact.ArtifactType.TEMPLATE_DEFINITION);
        updateReqest.setArtifactTypeObject(
          this.packTemplateDefinition(this.definition)
        );
        await new Promise((resolve, reject) =>
          this.ttfConnection.updateArtifact(
            updateReqest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
      }
      await this.refreshDefinition();
    }
  }

  private async setDefinitionName(name: string) {
    if (this.definition) {
      this.definition.getArtifact()?.setName(name);
      await this.saveDefintion(true);
    }
  }
}
