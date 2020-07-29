import * as ttfArtifact from "./ttf/artifact_pb";
import * as vscode from "vscode";
import * as protobufAny from "google-protobuf/google/protobuf/any_pb";

import { artifactPanelBaseEvents } from "./panels/artifactPanelBaseEvents";
import ArtifactUpdate from "./panels/artifactUpdate";
import { ITtfInterface } from "./ttfInterface";
import { PanelBase } from "./panelBase";
import { TaxonomyAsObjects } from "./panels/taxonomyAsObjects";
import { TokenTaxonomy } from "./tokenTaxonomy";

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
    } else if (message.e === artifactPanelBaseEvents.Update) {
      await this.update(message.update);
    } else {
      await this.onUnhandledMessage(message);
    }
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

  private resolveList(field: string): any[] | undefined {
    switch (field) {
      case "alias":
        return this.artifact?.getArtifact()?.getAliasesList();
      case "analogy.name":
        return this.artifact
          ?.getArtifact()
          ?.getArtifactDefinition()
          ?.getAnalogiesList();
    }
  }

  private resolveSetter(
    field: string,
    index?: number
  ): ((value: string) => void) | undefined {
    const analogies = this.artifact
      ?.getArtifact()
      ?.getArtifactDefinition()
      ?.getAnalogiesList();
    switch (field) {
      case "symbol":
        return (_) =>
          this.artifact?.getArtifact()?.getArtifactSymbol()?.setTooling(_);
      case "businessDescription":
        return (_) =>
          this.artifact
            ?.getArtifact()
            ?.getArtifactDefinition()
            ?.setBusinessDescription(_);
      case "businessExample":
        return (_) =>
          this.artifact
            ?.getArtifact()
            ?.getArtifactDefinition()
            ?.setBusinessExample(_);
      case "comments":
        return (_) =>
          this.artifact?.getArtifact()?.getArtifactDefinition()?.setComments(_);
      case "analogy.name":
        return analogies && index !== undefined
          ? (_) => analogies[index].setName(_)
          : (_) => {
              const analogy = new ttfArtifact.ArtifactAnalogy();
              analogy.setName(_);
              this.artifact
                ?.getArtifact()
                ?.getArtifactDefinition()
                ?.addAnalogies(analogy);
            };
      case "analogy.description":
        return analogies && index !== undefined
          ? (_) => analogies[index].setDescription(_)
          : undefined;
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

  private async update(update: ArtifactUpdate) {
    if (!this.artifact) {
      return;
    }
    switch (update.action) {
      case "add":
        await this.updateAdd(update.type, this.resolveList(update.type));
        break;
      case "delete":
        await this.updateDelete(
          this.resolveList(update.type),
          update.existing,
          update.index
        );
        break;
      case "editListItem":
        await this.updateEditListItem(
          this.resolveList(update.type),
          update.existing
        );
        break;
      case "editString":
        await this.updateEditString(
          this.resolveSetter(update.type, update.index),
          update.existing
        );
        break;
    }
    await this.saveChanges();
  }

  private async updateAdd(description: string, list?: any[]) {
    if (!list) {
      return;
    }
    const newValue = await vscode.window.showInputBox({
      prompt: "Enter the new " + description,
    });
    if (!newValue) {
      return;
    }
    list.push(newValue);
  }

  private async updateEditListItem(list?: string[], existing?: string) {
    if (!list || !existing || list.indexOf(existing) === -1) {
      return;
    }
    const newValue = await vscode.window.showInputBox({
      value: existing,
      prompt: "Enter the new value",
    });
    if (!newValue) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i] === existing) {
        list[i] = newValue;
        return;
      }
    }
  }

  private async updateEditString(
    setter?: (value: string) => void,
    existing?: string
  ) {
    if (!setter) {
      return;
    }
    const newValue = await vscode.window.showInputBox({
      value: existing,
      prompt: "Enter the new value",
    });
    if (!newValue && newValue !== "") {
      return;
    }
    setter(newValue);
  }

  private async updateDelete(
    list?: string[],
    existing?: string,
    index?: number
  ) {
    if (!list || (!existing && index === undefined)) {
      return;
    }
    const startAt =
      index !== undefined ? index : list.indexOf(existing as string);
    if (startAt === -1) {
      return;
    }
    for (let i = startAt; i < list.length - 1; i++) {
      list[i] = list[i + 1];
    }
    list.length--;
  }
}
