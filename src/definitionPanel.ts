import * as fs from "fs";
import * as path from "path";
import { taxonomy, google } from "./ttf/protobufs";
import * as vscode from "vscode";

import { definitionPanelEvents } from "./panels/definitionPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TokenTaxonomy } from "./tokenTaxonomy";

const JavascriptHrefPlaceholder: string = "[JAVASCRIPT_HREF]";
const CssHrefPlaceholder: string = "[CSS_HREF]";
const BaseHrefPlaceholder: string = "[BASE_HREF]";

export class DefinitionPanel {
  get title() {
    const suffix = " - " + this.environment;
    if (this.definition) {
      return (
        (this.definition.artifact?.name || "New definition") +
        " - Token Definition" +
        suffix
      );
    } else {
      return "Token Designer" + suffix;
    }
  }

  get iconPath() {
    return vscode.Uri.file(
      path.join(
        this.extensionPath,
        "resources",
        "token-designer",
        "token-base.svg"
      )
    );
  }

  private readonly panel: vscode.WebviewPanel;

  private definition: taxonomy.model.core.ITemplateDefinition | null = null;

  private disposed = false;

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
    private readonly extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    this.panel = vscode.window.createWebviewPanel(
      "definitionPanel",
      this.title,
      vscode.ViewColumn.Active,
      { enableScripts: true }
    );
    this.panel.iconPath = this.iconPath;
    this.panel.onDidDispose(this.onClose, this, disposables);
    this.panel.webview.onDidReceiveMessage(this.onMessage, this, disposables);
    this.panel.webview.html = this.getPanelHtml();

    this.refreshTaxonomy();
    this.ttfTaxonomy.onRefresh(this.refreshTaxonomy, this);

    panelReloadEvent((_) => {
      if (!this.disposed) {
        this.panel.webview.html = this.getPanelHtml();
      }
    });
  }

  dispose() {
    this.disposed = true;
    this.panel.dispose();
  }

  private getPanelHtml() {
    const htmlFileContents = fs.readFileSync(
      path.join(this.extensionPath, "src", "panels", "panel.html"),
      { encoding: "utf8" }
    );
    const javascriptHref: string =
      this.panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(
            this.extensionPath,
            "out",
            "panels",
            "bundles",
            "definitionPanel.main.js"
          )
        )
      ) +
      "?" +
      Math.random();
    const cssHref: string =
      this.panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(this.extensionPath, "out", "panels", "panel.css")
        )
      ) +
      "?" +
      Math.random();
    const baseHref: string =
      this.panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(this.extensionPath, "resources"))
      ) + "/";
    return htmlFileContents
      .replace(JavascriptHrefPlaceholder, javascriptHref)
      .replace(CssHrefPlaceholder, cssHref)
      .replace(BaseHrefPlaceholder, baseHref);
  }

  private async newDefinition(formulaId: any, name: string) {
    const newTemplateDefinition = taxonomy.model.artifact.NewTemplateDefinition.create();
    newTemplateDefinition.templateFormulaId = formulaId;
    newTemplateDefinition.tokenName = name;
    const result: taxonomy.model.core.ITemplateDefinition = await new Promise(
      (resolve, reject) =>
        this.ttfConnection.createTemplateDefinition(
          newTemplateDefinition,
          (error, response) => (error && reject(error)) || resolve(response)
        )
    );
    const newDefinitionId: string = result.artifact?.artifactSymbol?.id || "";
    this.refreshDefinition(newDefinitionId);
  }

  private async openDefinition(artifactId: string) {
    this.refreshDefinition(artifactId);
  }

  private onClose() {
    this.dispose();
  }

  private async onMessage(message: any) {
    if (message.e === definitionPanelEvents.Init) {
      this.panel.webview.postMessage({
        definition: this.definition,
        taxonomy: this.ttfTaxonomy.taxonomy,
      });
    } else if (message.e === definitionPanelEvents.SetDefinitionName) {
      await this.setDefinitionName(message.name);
    }
  }

  private packTemplateDefinition(
    definition: taxonomy.model.core.ITemplateDefinition
  ) {
    const any = google.protobuf.Any.create();
    any.value = taxonomy.model.core.TemplateDefinition.encode(
      definition
    ).finish();
    any.typeUrl = "taxonomy.model.core.TemplateDefinition";
    return any;
  }

  private async refreshDefinition(artifactId?: string | null) {
    artifactId = artifactId || this.definition?.artifact?.artifactSymbol?.id;
    if (artifactId) {
      const existingArtifactSymbol = taxonomy.model.artifact.ArtifactSymbol.create();
      existingArtifactSymbol.id = artifactId;
      this.definition = await new Promise((resolve, reject) =>
        this.ttfConnection.getTemplateDefinitionArtifact(
          existingArtifactSymbol,
          (error, response) => (error && reject(error)) || resolve(response)
        )
      );
    } else {
      this.definition = null;
    }
    this.panel.webview.postMessage({
      definition: this.definition,
      formula: null,
    });
    this.panel.title = this.title;
    this.panel.iconPath = this.iconPath;
    await this.ttfTaxonomy.refresh();
  }

  private async refreshTaxonomy() {
    if (!this.disposed) {
      this.panel.webview.postMessage({
        taxonomy: this.ttfTaxonomy.taxonomy,
      });
    }
  }

  private async saveDefintion(deleteAndRecreate: boolean = false) {
    if (this.definition) {
      if (deleteAndRecreate) {
        // Saving and deleting (instead of updating) allows for artifact names
        // to be changed and prevents the gRPC server from creating version
        // subfolders.
        const deleteSymbol = taxonomy.model.artifact.ArtifactSymbol.create();
        deleteSymbol.type =
          taxonomy.model.artifact.ArtifactType.TEMPLATE_DEFINITION;
        deleteSymbol.tooling =
          this.definition?.artifact?.artifactSymbol?.tooling || "";
        const deleteRequest = taxonomy.model.artifact.DeleteArtifactRequest.create();
        deleteRequest.artifactSymbol = deleteSymbol;
        await new Promise((resolve, reject) =>
          this.ttfConnection.deleteArtifact(
            deleteRequest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
        const newArtifactRequest = taxonomy.model.artifact.NewArtifactRequest.create();
        newArtifactRequest.type =
          taxonomy.model.artifact.ArtifactType.TEMPLATE_DEFINITION;
        newArtifactRequest.artifact = this.packTemplateDefinition(
          this.definition
        );
        await new Promise((resolve, reject) =>
          this.ttfConnection.createArtifact(
            newArtifactRequest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
      } else {
        const updateReqest = taxonomy.model.artifact.UpdateArtifactRequest.create();
        updateReqest.type =
          taxonomy.model.artifact.ArtifactType.TEMPLATE_DEFINITION;
        updateReqest.artifactTypeObject = this.packTemplateDefinition(
          this.definition
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
    if (this.definition && this.definition.artifact) {
      this.definition.artifact.name = name;
      await this.saveDefintion(true);
    }
  }
}
