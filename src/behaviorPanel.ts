import * as fs from "fs";
import * as path from "path";
import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";

import { behaviorPanelEvents } from "./panels/behaviorPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TaxonomyAsObjects } from "./panels/taxonomyAsObjects";
import { TokenTaxonomy } from "./tokenTaxonomy";

const JavascriptHrefPlaceholder: string = "[JAVASCRIPT_HREF]";
const CssHrefPlaceholder: string = "[CSS_HREF]";
const BaseHrefPlaceholder: string = "[BASE_HREF]";

export class BehaviorPanel {
  get title() {
    const suffix = " - " + this.environment;
    if (this.artifact) {
      return (
        (this.artifact.getArtifact()?.getName() || "New behavior") +
        " - Behavior" +
        suffix
      );
    } else {
      return "Behavior Designer" + suffix;
    }
  }

  get iconPath() {
    return vscode.Uri.file(
      path.join(
        this.extensionPath,
        "resources",
        "token-designer",
        "behavior.svg"
      )
    );
  }

  private readonly panel: vscode.WebviewPanel;

  private taxonomyObjects: TaxonomyAsObjects | null = null;

  private artifact: ttfCore.Behavior | null = null;

  private disposed = false;

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
    private readonly environment: string,
    private readonly ttfTaxonomy: TokenTaxonomy,
    private readonly extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    this.panel = vscode.window.createWebviewPanel(
      "behaviorPanel",
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
            "behaviorPanel.main.js"
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

  private async openArtifact(artifactId: string) {
    this.refreshArtifact(artifactId);
  }

  private onClose() {
    this.dispose();
  }

  private async onMessage(message: any) {
    if (message.e === behaviorPanelEvents.Init) {
      this.panel.webview.postMessage({
        artifact: this.artifact?.toObject(),
        taxonomy: this.taxonomyObjects,
      });
    }
  }

  private async refreshArtifact(artifactId: string) {
    const existingArtifactSymbol = new ttfArtifact.ArtifactSymbol();
    existingArtifactSymbol.setId(artifactId);
    this.artifact = await new Promise((resolve, reject) =>
      this.ttfConnection.getBehaviorArtifact(
        existingArtifactSymbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
    this.panel.webview.postMessage({
      artifact: this.artifact?.toObject(),
      formula: null,
    });
    this.panel.title = this.title;
    this.panel.iconPath = this.iconPath;
    await this.ttfTaxonomy.refresh();
  }

  private async refreshTaxonomy() {
    if (!this.disposed) {
      this.taxonomyObjects = this.ttfTaxonomy.asObjects();
      this.panel.webview.postMessage({ taxonomy: this.taxonomyObjects });
    }
  }
}
