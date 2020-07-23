import * as ttfArtifact from "./ttf/artifact_pb";
import * as vscode from "vscode";
import * as protobufAny from "google-protobuf/google/protobuf/any_pb";

import { artifactPanelBaseEvents } from "./panels/artifactPanelBaseEvents";
import { PanelBase } from "./panelBase";
import { TaxonomyAsObjects } from "./panels/taxonomyAsObjects";
import { TokenTaxonomy } from "./tokenTaxonomy";
import { ITtfInterface } from "./ttfInterface";

export abstract class ArtifactPanelBase<
  T extends {
    getArtifact(): ttfArtifact.Artifact | undefined;
    toObject(): any;
    serializeBinary(): Uint8Array;
  }
> extends PanelBase {
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

  private taxonomyObjects: TaxonomyAsObjects | null = null;

  private artifact: T | null = null;

  protected constructor(
    protected readonly ttfConnection: ITtfInterface,
    private readonly ttfClassName: string,
    private readonly environment: string,
    private readonly ttfTaxonomy: TokenTaxonomy,
    private readonly artifactTypeString: string,
    iconSvg: string,
    panelId: string,
    clientScript: string,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    super(panelId, clientScript, extensionPath, disposables, panelReloadEvent);
    this.setTitle(this.title, iconSvg);

    this.refreshTaxonomy();
    this.ttfTaxonomy.onRefresh(this.refreshTaxonomy, this);
  }

  protected abstract async onUnhandledMessage(message: any): Promise<void>;

  protected abstract async getArtifact(
    symbol: ttfArtifact.ArtifactSymbol
  ): Promise<T>;

  protected async openArtifact(artifactId: string) {
    this.refreshArtifact(artifactId);
  }

  protected postCurrentState() {
    this.postMessage({
      artifact: this.artifact?.toObject(),
      taxonomy: this.taxonomyObjects,
    });
  }

  protected async onMessage(message: any) {
    if (message.e === artifactPanelBaseEvents.Init) {
      this.postCurrentState();
    } else if (message.e === artifactPanelBaseEvents.Rename) {
      await this.rename();
    } else {
      await this.onUnhandledMessage(message);
    }
  }

  private async rename() {
    if (this.artifact) {
      const newName = await vscode.window.showInputBox({
        value: this.artifact?.getArtifact()?.getName(),
        prompt: "Enter a new name for this artifact",
      });
      if (!newName) {
        return;
      }
      this.artifact.getArtifact()?.setName(newName);
      await this.saveChanges();
    }
  }

  private async saveChanges() {
    const symbol = this.artifact?.getArtifact()?.getArtifactSymbol();
    if (!this.artifact || !symbol) {
      return;
    }
    const any = new protobufAny.Any();
    any.pack(this.artifact.serializeBinary(), this.ttfClassName);
    const updateReqest = new ttfArtifact.UpdateArtifactRequest();
    updateReqest.setType(symbol.getType());
    updateReqest.setArtifactTypeObject(any);
    await new Promise((resolve, reject) =>
      this.ttfConnection.updateArtifact(
        updateReqest,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
    await this.refreshArtifact(symbol.getId());
  }

  private async refreshArtifact(artifactId: string) {
    const existingArtifactSymbol = new ttfArtifact.ArtifactSymbol();
    existingArtifactSymbol.setId(artifactId);
    this.artifact = await this.getArtifact(existingArtifactSymbol);
    this.postCurrentState();
    this.setTitle(this.title);
    await this.ttfTaxonomy.refresh();
    this.refreshTaxonomy();
  }

  private refreshTaxonomy() {
    this.taxonomyObjects = this.ttfTaxonomy.asObjects();
    this.postMessage({ taxonomy: this.taxonomyObjects });
  }
}
