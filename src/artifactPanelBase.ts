import * as fs from "fs";
import * as path from "path";
import * as ttfArtifact from "./ttf/artifact_pb";
import * as vscode from "vscode";

import { TaxonomyAsObjects } from "./panels/taxonomyAsObjects";
import { TokenTaxonomy } from "./tokenTaxonomy";

const JavascriptHrefPlaceholder: string = "[JAVASCRIPT_HREF]";
const CssHrefPlaceholder: string = "[CSS_HREF]";
const BaseHrefPlaceholder: string = "[BASE_HREF]";

export abstract class ArtifactPanelBase<
  T extends { getArtifact(): ttfArtifact.Artifact | undefined; toObject(): any }
> {
  get title() {
    const suffix = ` -  ${this.environment}`;
    if (this.artifact) {
      const name =
        this.artifact.getArtifact()?.getName() ||
        `New  ${this.artifactTypeString}`;
      return `${name} - ${this.artifactTypeString} ${suffix}`;
    } else {
      return `${this.artifactTypeString} Designer ${suffix}`;
    }
  }

  get iconPath() {
    return vscode.Uri.file(
      path.join(this.extensionPath, "resources", "token-designer", this.svgName)
    );
  }

  private readonly panel: vscode.WebviewPanel;

  private taxonomyObjects: TaxonomyAsObjects | null = null;

  private artifact: T | null = null;

  private disposed = false;

  protected constructor(
    private readonly artifactTypeString: string,
    private readonly svgName: string,
    private readonly panelId: string,
    private readonly clientScript: string,
    private readonly environment: string,
    private readonly ttfTaxonomy: TokenTaxonomy,
    private readonly extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    this.panel = vscode.window.createWebviewPanel(
      this.panelId,
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

  protected abstract async onMessage(message: any): Promise<void>;

  protected abstract async getArtifact(
    symbol: ttfArtifact.ArtifactSymbol
  ): Promise<T>;

  protected async openArtifact(artifactId: string) {
    this.refreshArtifact(artifactId);
  }

  protected postCurrentState() {
    this.panel.webview.postMessage({
      artifact: this.artifact?.toObject(),
      taxonomy: this.taxonomyObjects,
    });
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
            this.clientScript
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

  private onClose() {
    this.dispose();
  }

  private async refreshArtifact(artifactId: string) {
    const existingArtifactSymbol = new ttfArtifact.ArtifactSymbol();
    existingArtifactSymbol.setId(artifactId);
    this.artifact = await this.getArtifact(existingArtifactSymbol);
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
