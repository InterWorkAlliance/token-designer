import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const JavascriptHrefPlaceholder: string = "[JAVASCRIPT_HREF]";
const CssHrefPlaceholder: string = "[CSS_HREF]";
const BaseHrefPlaceholder: string = "[BASE_HREF]";

export abstract class PanelBase {
  private readonly panel: vscode.WebviewPanel;

  private disposed = false;

  protected constructor(
    private readonly panelId: string,
    private readonly clientScript: string,
    private readonly extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    this.panel = vscode.window.createWebviewPanel(
      this.panelId,
      "Loading...",
      vscode.ViewColumn.Active,
      { enableScripts: true }
    );
    this.panel.iconPath = this.iconPath("unknown.svg");
    this.panel.onDidDispose(this.onClose, this, disposables);
    this.panel.webview.onDidReceiveMessage(this.onMessage, this, disposables);
    this.panel.webview.html = this.getPanelHtml();
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

  protected setTitle(title: string, iconSvg?: string) {
    if (!this.disposed) {
      this.panel.title = title;
      if (iconSvg) {
        this.panel.iconPath = this.iconPath(iconSvg);
      }
    }
  }

  protected abstract async onMessage(message: any): Promise<void>;

  protected postMessage(message: any) {
    if (!this.disposed) {
      this.panel.webview.postMessage(message);
    }
  }

  private iconPath(iconSvg: string) {
    return vscode.Uri.file(
      path.join(this.extensionPath, "resources", "token-designer", iconSvg)
    );
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
}
