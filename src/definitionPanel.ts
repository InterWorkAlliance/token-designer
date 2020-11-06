import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";
import * as protobufAny from "google-protobuf/google/protobuf/any_pb";

import { definitionPanelEvents } from "./panels/definitionPanelEvents";
import { FormulaPanel } from "./formulaPanel";
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
    private readonly disposables: vscode.Disposable[],
    private readonly panelReloadEvent: vscode.Event<void>
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
    } else if (message.e === definitionPanelEvents.SetProperty) {
      await this.setDefinitionProperty(message.path, message.name);
    } else if (message.e === definitionPanelEvents.LoadFormula) {
      await FormulaPanel.openExistingFormula(
        message.t,
        this.ttfConnection,
        this.environment,
        this.ttfTaxonomy,
        this.extensionPath,
        this.disposables,
        this.panelReloadEvent
      );
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
        deleteSymbol.setId(
          this.definition?.getArtifact()?.getArtifactSymbol()?.getId() || ""
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

  private async setDefinitionProperty(path: string, name: string) {
    let pathComponents = path.split("/");
    const reference = pathComponents[0];
    pathComponents = pathComponents.slice(1);
    if (!reference) {
      console.warn("Invalid property path", path, name);
      return;
    }
    if (!this.definition) {
      console.warn("Definition not loaded", path, name);
      return;
    }
    let behaviors = this.definition.getBehaviorsList();
    for (const behaviorGroup of this.definition.getBehaviorGroupsList()) {
      behaviors = [...behaviors, ...behaviorGroup.getBehaviorArtifactsList()];
    }
    const parent =
      behaviors.find((_) => _.getReference()?.getId() === reference) ||
      this.definition
        .getPropertySetsList()
        .find((_) => _.getReference()?.getId() === reference);
    if (parent) {
      let properties:
        | ttfCore.Property[]
        | undefined = parent.getPropertiesList();
      while (pathComponents.length) {
        properties = properties
          ?.find((_) => _.getName() === pathComponents[0])
          ?.getPropertiesList();
        pathComponents = pathComponents.slice(1);
      }
      if (properties) {
        const property = properties.find((_) => _.getName() === name);
        if (property) {
          const newValue = await vscode.window.showInputBox({
            prompt: "Enter a new value for " + name,
            value: property.getTemplateValue(),
          });
          if (newValue) {
            property.setTemplateValue(newValue);
          } else {
            console.warn("User canceled property change", path, name);
            return;
          }
        } else {
          console.warn("Could not find property", path, name);
        }
      } else {
        console.warn("Could not find nested property", path, name);
        return;
      }
    } else {
      console.warn("Could not find reference", path, name);
      return;
    }
    await this.saveDefintion(true);
  }
}
