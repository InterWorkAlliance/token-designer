import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const JavascriptHrefPlaceholder: string = "[JAVASCRIPT_HREF]";
const CssHrefPlaceholder: string = "[CSS_HREF]";
const BaseHrefPlaceholder: string = "[BASE_HREF]";

const millisecondTimestamp = () => new Date().getTime();

export abstract class PanelBase {
  private panel: vscode.WebviewPanel;

  private disposed = false;

  private lastPing: number;

  private watchdogInterval: NodeJS.Timeout;

  private panelCloseWatcher: vscode.Disposable | undefined;

  protected constructor(
    private readonly panelId: string,
    private readonly clientScript: string,
    protected readonly extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const createPanel = () => {
      this.panel = vscode.window.createWebviewPanel(
        this.panelId,
        "Loading...",
        vscode.ViewColumn.Active,
        { enableScripts: true }
      );
      this.panel.iconPath = this.iconPath("unknown.svg");
      this.panelCloseWatcher = this.panel.onDidDispose(
        this.onClose,
        this,
        disposables
      );
      this.panel.webview.onDidReceiveMessage(
        this.onMessageInternal,
        this,
        disposables
      );
      this.panel.webview.html = this.getPanelHtml();
      return this.panel;
    };

    this.panel = createPanel();

    panelReloadEvent((_) => {
      if (!this.disposed) {
        this.panel.webview.html = this.getPanelHtml();
      }
    });

    // Panels are expected to be wrapped inside a <PanelWatchdog /> component, which will send
    // a "ping" message once every 500ms when the panel is visible and responding. If the panel
    // is visible but a ping has not been received for more than 2.5s, we refresh the panel.
    this.lastPing = millisecondTimestamp();
    this.watchdogInterval = setInterval(() => {
      if (!this.disposed) {
        if (!this.panel.visible) {
          // JavaScript is not expected to run within panels that are not visible
          this.lastPing = millisecondTimestamp();
        } else if (millisecondTimestamp() - this.lastPing > 1000) {
          console.error(`Reloading unresponsivle panel ${this.panelId}`);
          this.lastPing = millisecondTimestamp();
          const [currentTitle, currentIconPath] = [
            this.panel.title,
            this.panel.iconPath,
          ];
          if (this.panelCloseWatcher) {
            this.panelCloseWatcher.dispose();
          }
          this.panel.dispose();
          createPanel();
          this.panel.title = currentTitle;
          this.panel.iconPath = currentIconPath;
        }
      }
    }, 300);
  }

  dispose() {
    this.disposed = true;
    clearInterval(this.watchdogInterval);
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

  private async onMessageInternal(message: any) {
    if (message.ping) {
      this.lastPing = millisecondTimestamp();
    } else {
      this.onMessage(message);
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
