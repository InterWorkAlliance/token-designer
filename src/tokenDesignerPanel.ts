import * as fs from "fs";
import * as path from "path";
import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as uuid from "uuid";
import * as vscode from "vscode";
import * as protobufAny from "google-protobuf/google/protobuf/any_pb";

import { TokenTaxonomy } from "./tokenTaxonomy";
import { tokenDesignerEvents } from "./panels/tokenDesignerEvents";
import { TokenDesignerTaxonomy } from "./panels/tokenDesignerTaxonomy";
import { ITtfInterface } from "./ttfInterface";

const JavascriptHrefPlaceholder: string = "[JAVASCRIPT_HREF]";
const CssHrefPlaceholder: string = "[CSS_HREF]";
const BaseHrefPlaceholder: string = "[BASE_HREF]";

export class TokenDesignerPanel {
  get title() {
    const suffix = " (" + this.environment + ")";
    if (this.formula) {
      return (
        (this.formula.getArtifact()?.getName() || "New formula") +
        " - Token Formula" +
        suffix
      );
    } else if (this.definition) {
      return (
        (this.definition.getArtifact()?.getName() || "New definition") +
        " - Token Definition" +
        suffix
      );
    } else {
      return "Token Designer" + suffix;
    }
  }

  get iconPath() {
    if (this.formula) {
      return vscode.Uri.file(
        path.join(
          this.extensionPath,
          "resources",
          "token-designer",
          "unknown.svg"
        )
      );
    } else {
      return vscode.Uri.file(
        path.join(
          this.extensionPath,
          "resources",
          "token-designer",
          "token-base.svg"
        )
      );
    }
  }

  private readonly panel: vscode.WebviewPanel;

  private taxonomyObjects: TokenDesignerTaxonomy | null = null;

  private definition: ttfCore.TemplateDefinition | null = null;

  private formula: ttfCore.TemplateFormula | null = null;

  private incompatabilities: any = {};

  private disposed = false;

  static async openNewFormula(
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new TokenDesignerPanel(
      ttfConnection,
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
    panel.newFormula();
    return panel;
  }

  static async openExistingFormula(
    toolingSymbol: string,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new TokenDesignerPanel(
      ttfConnection,
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
    await panel.openFormula(toolingSymbol);
    return panel;
  }

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
      const panel = new TokenDesignerPanel(
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
    const panel = new TokenDesignerPanel(
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
      "tokenDesigner",
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

  private async addArtifact(id: string) {
    const toAdd = this.getArtifcactById(id);
    if (this.formula && toAdd) {
      await this.removeArtifact(id, false); // avoid duplicates
      const addType = toAdd.getArtifact()?.getArtifactSymbol()?.getType();
      switch (addType) {
        case ttfArtifact.ArtifactType.BASE:
          const templateBase = new ttfCore.TemplateBase();
          templateBase.setBase(toAdd.getArtifact()?.getArtifactSymbol());
          this.formula.setTokenBase(templateBase);
          break;
        case ttfArtifact.ArtifactType.PROPERTY_SET:
          const templatePropertySet = new ttfCore.TemplatePropertySet();
          templatePropertySet.setPropertySet(
            toAdd.getArtifact()?.getArtifactSymbol()
          );
          this.formula.getPropertySetsList().push(templatePropertySet);
          break;
        case ttfArtifact.ArtifactType.BEHAVIOR:
          const templateBehavior = new ttfCore.TemplateBehavior();
          templateBehavior.setBehavior(
            toAdd.getArtifact()?.getArtifactSymbol()
          );
          this.formula.getBehaviorsList().push(templateBehavior);
          break;
        case ttfArtifact.ArtifactType.BEHAVIOR_GROUP:
          const templateBehaviorGroup = new ttfCore.TemplateBehaviorGroup();
          templateBehaviorGroup.setBehaviorGroup(
            toAdd.getArtifact()?.getArtifactSymbol()
          );
          this.formula.getBehaviorGroupsList().push(templateBehaviorGroup);
          break;
      }
      await this.saveFormula();
    }
  }

  private getArtifcactById(id?: string) {
    const taxonomy = this.ttfTaxonomy.taxonomy;
    if (!id || !taxonomy) {
      return undefined;
    }
    return (
      taxonomy.getBaseTokenTypesMap().get(id) ||
      taxonomy.getPropertySetsMap().get(id) ||
      taxonomy.getBehaviorsMap().get(id) ||
      taxonomy.getBehaviorGroupsMap().get(id)
    );
  }

  private getPanelHtml() {
    const htmlFileContents = fs.readFileSync(
      path.join(this.extensionPath, "src", "panels", "designer.html"),
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
            "designer.main.js"
          )
        )
      ) +
      "?" +
      Math.random();
    const cssHref: string =
      this.panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(this.extensionPath, "out", "panels", "designer.css")
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

  private async newFormula() {
    const id = uuid.v1();
    const temporaryTooling = id;
    const newArtifactSymbol = new ttfArtifact.ArtifactSymbol();
    newArtifactSymbol.setId(id);
    newArtifactSymbol.setTooling(temporaryTooling);
    newArtifactSymbol.setVisual("");
    newArtifactSymbol.setVersion("1.0,");
    newArtifactSymbol.setType(ttfArtifact.ArtifactType.TEMPLATE_FORMULA);
    newArtifactSymbol.setTemplateValidated(false);
    const newArtifactDefinition = new ttfArtifact.ArtifactDefinition();
    newArtifactDefinition.setBusinessDescription(
      "Enter a business description here"
    );
    const newArtifact = new ttfArtifact.Artifact();
    newArtifact.setName("Untitled");
    newArtifact.setArtifactDefinition(newArtifactDefinition);
    newArtifact.setArtifactSymbol(newArtifactSymbol);
    const newFormula = new ttfCore.TemplateFormula();
    newFormula.setArtifact(newArtifact);
    const newArtifactRequest = new ttfArtifact.NewArtifactRequest();
    newArtifactRequest.setType(ttfArtifact.ArtifactType.TEMPLATE_FORMULA);
    newArtifactRequest.setArtifact(this.packTemplateFormula(newFormula));
    await new Promise((resolve, reject) =>
      this.ttfConnection.createArtifact(
        newArtifactRequest,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
    this.refreshFormula(temporaryTooling);
  }

  private async openFormula(symbol: string) {
    this.refreshFormula(symbol);
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

  private onClose() {
    this.dispose();
  }

  private async onMessage(message: any) {
    if (message.e === tokenDesignerEvents.Init) {
      this.panel.webview.postMessage({
        definition: this.definition?.toObject(),
        formula: this.formula?.toObject(),
        taxonomy: this.taxonomyObjects,
        incompatabilities: this.incompatabilities,
      });
    } else if (message.e === tokenDesignerEvents.Add) {
      await this.addArtifact(message.id);
    } else if (message.e === tokenDesignerEvents.Remove) {
      await this.removeArtifact(message.id);
    } else if (message.e === tokenDesignerEvents.SetDefinitionProperty) {
      await this.setDefinitionProperty(
        message.artifactId,
        message.propertyName,
        message.value
      );
    } else if (message.e === tokenDesignerEvents.SetDefinitionName) {
      await this.setDefinitionName(message.name);
    } else if (message.e === tokenDesignerEvents.SetFormulaDescription) {
      await this.setFormulaDescription(message.description);
    }
  }

  private packTemplateDefinition(definition: ttfCore.TemplateDefinition) {
    const any = new protobufAny.Any();
    any.pack(
      definition.serializeBinary(),
      "taxonomy.model.core.TemplateDefinition"
    );
    return any;
  }

  private packTemplateFormula(formula: ttfCore.TemplateFormula) {
    const any = new protobufAny.Any();
    any.pack(formula.serializeBinary(), "taxonomy.model.core.TemplateFormula");
    return any;
  }

  private async refreshDefinition(artifactId?: string) {
    this.formula = null;
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
    this.updateIncompatibilities();
    this.panel.webview.postMessage({
      definition: this.definition?.toObject(),
      formula: null,
      incompatabilities: this.incompatabilities,
    });
    this.panel.title = this.title;
    this.panel.iconPath = this.iconPath;
    await this.ttfTaxonomy.refresh();
  }

  private async refreshFormula(symbol?: string) {
    this.definition = null;
    symbol =
      symbol || this.formula?.getArtifact()?.getArtifactSymbol()?.getTooling();
    if (symbol) {
      const existingArtifactSymbol = new ttfArtifact.ArtifactSymbol();
      existingArtifactSymbol.setTooling(symbol);
      this.formula = await new Promise((resolve, reject) =>
        this.ttfConnection.getTemplateFormulaArtifact(
          existingArtifactSymbol,
          (error, response) => (error && reject(error)) || resolve(response)
        )
      );
    } else {
      this.formula = null;
    }
    this.updateIncompatibilities();
    this.panel.webview.postMessage({
      definition: null,
      formula: this.formula?.toObject() || null,
      incompatabilities: this.incompatabilities,
    });
    this.panel.title = this.title;
    this.panel.iconPath = this.iconPath;
    await this.ttfTaxonomy.refresh();
  }

  private async refreshTaxonomy() {
    if (!this.disposed) {
      const taxonomy = this.ttfTaxonomy.taxonomy;
      if (taxonomy) {
        const taxonomyObject = taxonomy.toObject();
        this.taxonomyObjects = {
          baseTokenTypes: taxonomyObject.baseTokenTypesMap
            .map((_) => _[1])
            .sort(
              (a, b) =>
                a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
            ),
          propertySets: taxonomyObject.propertySetsMap
            .map((_) => _[1])
            .sort(
              (a, b) =>
                a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
            ),
          behaviors: taxonomyObject.behaviorsMap
            .map((_) => _[1])
            .sort(
              (a, b) =>
                a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
            ),
          behaviorGroups: taxonomyObject.behaviorGroupsMap
            .map((_) => _[1])
            .sort(
              (a, b) =>
                a.artifact?.name.localeCompare(b.artifact?.name || "") || 0
            ),
        };
      } else {
        this.taxonomyObjects = null;
      }
      this.panel.webview.postMessage({ taxonomy: this.taxonomyObjects });
    }
  }

  private async removeArtifact(id: string, save: boolean = true) {
    const toRemove = this.getArtifcactById(id);
    if (this.formula && toRemove) {
      if (this.formula.getTokenBase()?.getBase()?.getId() === id) {
        this.formula.setTokenBase(undefined);
      } else {
        this.formula.setPropertySetsList(
          this.formula
            .getPropertySetsList()
            .filter((_) => _.getPropertySet()?.getId() !== id)
        );
        this.formula.setBehaviorsList(
          this.formula
            .getBehaviorsList()
            .filter((_) => _.getBehavior()?.getId() !== id)
        );
        this.formula.setBehaviorGroupsList(
          this.formula
            .getBehaviorGroupsList()
            .filter((_) => _.getBehaviorGroup()?.getId() !== id)
        );
      }
      if (save) {
        await this.saveFormula();
      }
    }
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

  private async saveFormula(forceDeleteAndRecreate?: boolean) {
    if (this.formula) {
      const deleteAndRecreate = this.updateSymbol();
      if (forceDeleteAndRecreate || deleteAndRecreate) {
        const deleteSymbol = new ttfArtifact.ArtifactSymbol();
        deleteSymbol.setType(ttfArtifact.ArtifactType.TEMPLATE_FORMULA);
        deleteSymbol.setId(
          this.formula.getArtifact()?.getArtifactSymbol()?.getId() || ""
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
        newArtifactRequest.setType(ttfArtifact.ArtifactType.TEMPLATE_FORMULA);
        newArtifactRequest.setArtifact(this.packTemplateFormula(this.formula));
        await new Promise((resolve, reject) =>
          this.ttfConnection.createArtifact(
            newArtifactRequest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
      } else {
        const updateReqest = new ttfArtifact.UpdateArtifactRequest();
        updateReqest.setType(ttfArtifact.ArtifactType.TEMPLATE_FORMULA);
        updateReqest.setArtifactTypeObject(
          this.packTemplateFormula(this.formula)
        );
        await new Promise((resolve, reject) =>
          this.ttfConnection.updateArtifact(
            updateReqest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
      }
      this.refreshFormula();
    }
  }

  private async setDefinitionProperty(
    artifactId: string,
    propertyName: string,
    value: string
  ) {
    const findAndSet = (
      list: ttfCore.BehaviorReference[] | ttfCore.PropertySetReference[]
    ) => {
      for (const behavior of list) {
        if (behavior.getReference()?.getId() === artifactId) {
          for (const property of behavior.getPropertiesList()) {
            if (property.getName() === propertyName) {
              property.setTemplateValue(value);
            }
          }
        }
      }
    };
    if (this.definition) {
      findAndSet(this.definition.getBehaviorsList());
      this.definition
        .getBehaviorGroupsList()
        .forEach((bgl) => findAndSet(bgl.getBehaviorArtifactsList()));
      findAndSet(this.definition.getPropertySetsList());
      await this.saveDefintion();
    }
  }

  private async setDefinitionName(name: string) {
    if (this.definition) {
      this.definition.getArtifact()?.setName(name);
      await this.saveDefintion(true);
    }
  }

  private async setFormulaDescription(description: string) {
    if (this.formula) {
      this.formula
        .getArtifact()
        ?.getArtifactDefinition()
        ?.setBusinessDescription(description);
      await this.saveFormula(true);
    }
  }

  private updateIncompatibilities() {
    const newIncompatabilities: any = {};
    if (this.formula) {
      const allIds = [];
      allIds.push(this.formula.getTokenBase()?.getBase()?.getId());
      allIds.push(
        ...this.formula.getBehaviorsList().map((_) => _.getBehavior()?.getId())
      );
      allIds.push(
        ...this.formula
          .getBehaviorGroupsList()
          .map((_) => _.getBehaviorGroup()?.getId())
      );
      allIds.push(
        ...this.formula
          .getPropertySetsList()
          .map((_) => _.getPropertySet()?.getId())
      );
      for (const id of allIds) {
        const artifact = this.getArtifcactById(id);
        if (artifact) {
          const artifactName = artifact.getArtifact()?.getName();
          for (const artifactIncompatibleWith of artifact
            .getArtifact()
            ?.getIncompatibleWithSymbolsList() || []) {
            if (newIncompatabilities[artifactIncompatibleWith.getId()]) {
              newIncompatabilities[artifactIncompatibleWith.getId()].push(
                artifactName
              );
            } else {
              newIncompatabilities[artifactIncompatibleWith.getId()] = [
                artifactName,
              ];
            }
          }
        }
      }
    }
    this.incompatabilities = newIncompatabilities;
  }

  private updateSymbol() {
    if (this.formula) {
      const tokenBaseTooling =
        this.formula.getTokenBase()?.getBase()?.getTooling() || "?{}";
      const tokenBaseVisual =
        this.formula.getTokenBase()?.getBase()?.getVisual() || "?{}";
      let [tooling, includedBehaviorsTooling] = tokenBaseTooling
        .replace("}", "")
        .split("{", 2);
      let [visual, includedBehaviorsVisual] = tokenBaseVisual
        .replace("}", "")
        .split("{", 2);
      const behaviorsTooling = (includedBehaviorsTooling || "").split(",");
      const behaviorsVisual = (includedBehaviorsVisual || "").split(",");
      for (const behavior of this.formula.getBehaviorsList()) {
        if (
          behaviorsTooling.indexOf(
            behavior.getBehavior()?.getTooling() || ""
          ) === -1
        ) {
          behaviorsTooling.push(behavior.getBehavior()?.getTooling() || "?");
          behaviorsVisual.push(behavior.getBehavior()?.getVisual() || "?");
        }
      }
      for (const behaviorGroup of this.formula.getBehaviorGroupsList()) {
        if (
          behaviorsTooling.indexOf(
            behaviorGroup.getBehaviorGroup()?.getTooling() || ""
          ) === -1
        ) {
          behaviorsTooling.push(
            behaviorGroup.getBehaviorGroup()?.getTooling() || "?"
          );
          behaviorsVisual.push(
            behaviorGroup.getBehaviorGroup()?.getVisual() || "?"
          );
        }
      }
      tooling += "{" + behaviorsTooling.join(",") + "}";
      visual += "{" + behaviorsVisual.join(",") + "}";
      let containsAdditions = false;
      for (const propertySet of this.formula.getPropertySetsList()) {
        containsAdditions = true;
        tooling += "+" + (propertySet.getPropertySet()?.getTooling() || "?");
        visual += "+" + (propertySet.getPropertySet()?.getVisual() || "?");
      }
      if (containsAdditions) {
        tooling = "[" + tooling + "]";
        visual = "[" + visual + "]";
      }
      this.formula.getArtifact()?.getArtifactSymbol()?.setTooling(tooling);
      this.formula.getArtifact()?.getArtifactSymbol()?.setVisual(visual);
      // By convention, formulae use their tooling symbol as their name:
      if (this.formula.getArtifact()?.getName() !== tooling) {
        this.formula.getArtifact()?.setName(tooling);
        return true; // delete-and-create instead of update
      } else {
        return false;
      }
    }
  }
}
