import * as fs from "fs";
import * as path from "path";
import { taxonomy, google } from "./ttf/protobufs";
import * as uuid from "uuid";
import * as vscode from "vscode";

import { formulaPanelEvents } from "./panels/formulaPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TokenTaxonomy } from "./tokenTaxonomy";

const JavascriptHrefPlaceholder: string = "[JAVASCRIPT_HREF]";
const CssHrefPlaceholder: string = "[CSS_HREF]";
const BaseHrefPlaceholder: string = "[BASE_HREF]";

export class FormulaPanel {
  get title() {
    const suffix = " - " + this.environment;
    if (this.formula) {
      return (
        (this.formula.artifact?.name || "New formula") +
        " - Token Formula" +
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
        "unknown.svg"
      )
    );
  }

  private readonly panel: vscode.WebviewPanel;

  private formula: taxonomy.model.core.ITemplateFormula | null = null;

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
    const panel = new FormulaPanel(
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
    const panel = new FormulaPanel(
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

  private constructor(
    private readonly ttfConnection: ITtfInterface,
    private readonly environment: string,
    private readonly ttfTaxonomy: TokenTaxonomy,
    private readonly extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    this.panel = vscode.window.createWebviewPanel(
      "formulaPanel",
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
    const toAdd = this.ttfTaxonomy.getArtifcactById(id);
    if (this.formula && toAdd) {
      await this.removeArtifact(id, false); // avoid duplicates
      const addType = toAdd.artifact?.artifactSymbol?.type;
      switch (addType) {
        case taxonomy.model.artifact.ArtifactType.BASE:
          const templateBase = taxonomy.model.core.TemplateBase.create();
          templateBase.base = toAdd.artifact?.artifactSymbol;
          this.formula.tokenBase = templateBase;
          break;
        case taxonomy.model.artifact.ArtifactType.PROPERTY_SET:
          const templatePropertySet = taxonomy.model.core.TemplatePropertySet.create();
          templatePropertySet.propertySet = toAdd.artifact?.artifactSymbol;
          this.formula.propertySets = this.formula.propertySets || [];
          this.formula.propertySets.push(templatePropertySet);
          break;
        case taxonomy.model.artifact.ArtifactType.BEHAVIOR:
          const templateBehavior = taxonomy.model.core.TemplateBehavior.create();
          templateBehavior.behavior = toAdd.artifact?.artifactSymbol;
          this.formula.behaviors = this.formula.behaviors || [];
          this.formula.behaviors.push(templateBehavior);
          break;
        case taxonomy.model.artifact.ArtifactType.BEHAVIOR_GROUP:
          const templateBehaviorGroup = taxonomy.model.core.TemplateBehaviorGroup.create();
          templateBehaviorGroup.behaviorGroup = toAdd.artifact?.artifactSymbol;
          this.formula.behaviorGroups = this.formula.behaviorGroups || [];
          this.formula.behaviorGroups.push(templateBehaviorGroup);
          break;
      }
      await this.saveFormula();
    }
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
            "formulaPanel.main.js"
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

  private async newFormula() {
    const id = uuid.v1();
    const temporaryTooling = id;
    const newArtifactSymbol = taxonomy.model.artifact.ArtifactSymbol.create();
    newArtifactSymbol.id = id;
    newArtifactSymbol.tooling = temporaryTooling;
    newArtifactSymbol.visual = "";
    newArtifactSymbol.version = "1.0,";
    newArtifactSymbol.type =
      taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA;
    newArtifactSymbol.templateValidated = false;
    const newArtifactDefinition = taxonomy.model.artifact.ArtifactDefinition.create();
    newArtifactDefinition.businessDescription =
      "Enter a business description here";
    const newArtifact = taxonomy.model.artifact.Artifact.create();
    newArtifact.name = "Untitled";
    newArtifact.artifactDefinition = newArtifactDefinition;
    newArtifact.artifactSymbol = newArtifactSymbol;
    const newFormula = taxonomy.model.core.TemplateFormula.create();
    newFormula.artifact = newArtifact;
    const newArtifactRequest = taxonomy.model.artifact.NewArtifactRequest.create();
    newArtifactRequest.type =
      taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA;
    newArtifactRequest.artifact = this.packTemplateFormula(newFormula);
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

  private onClose() {
    this.dispose();
  }

  private async onMessage(message: any) {
    if (message.e === formulaPanelEvents.Init) {
      this.panel.webview.postMessage({
        formula: this.formula,
        taxonomy: this.ttfTaxonomy.taxonomy,
        incompatabilities: this.incompatabilities,
      });
    } else if (message.e === formulaPanelEvents.Add) {
      await this.addArtifact(message.id);
    } else if (message.e === formulaPanelEvents.Remove) {
      await this.removeArtifact(message.id);
    } else if (message.e === formulaPanelEvents.SetFormulaDescription) {
      await this.setFormulaDescription(message.description);
    }
  }

  private packTemplateFormula(formula: taxonomy.model.core.ITemplateFormula) {
    const any = google.protobuf.Any.create();
    any.value = taxonomy.model.core.TemplateFormula.encode(formula).finish();
    any.typeUrl = "taxonomy.model.core.TemplateFormula";
    return any;
  }

  private async refreshFormula(symbol?: string | null) {
    symbol = symbol || this.formula?.artifact?.artifactSymbol?.tooling;
    if (symbol) {
      const existingArtifactSymbol = taxonomy.model.artifact.ArtifactSymbol.create();
      existingArtifactSymbol.tooling = symbol;
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
      formula: this.formula,
      incompatabilities: this.incompatabilities,
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

  private async removeArtifact(id: string, save: boolean = true) {
    const toRemove = this.ttfTaxonomy.getArtifcactById(id);
    if (this.formula && toRemove) {
      if (this.formula.tokenBase?.base?.id === id) {
        this.formula.tokenBase = undefined;
      } else {
        this.formula.propertySets = this.formula.propertySets?.filter(
          (_) => _.propertySet?.id !== id
        );
        this.formula.behaviors = this.formula.behaviors?.filter(
          (_) => _.behavior?.id !== id
        );
        this.formula.behaviorGroups = this.formula.behaviorGroups?.filter(
          (_) => _.behaviorGroup?.id !== id
        );
      }
      if (save) {
        await this.saveFormula();
      }
    }
  }

  private async saveFormula(forceDeleteAndRecreate?: boolean) {
    if (this.formula) {
      const deleteAndRecreate = this.updateSymbol();
      if (forceDeleteAndRecreate || deleteAndRecreate) {
        const deleteSymbol = taxonomy.model.artifact.ArtifactSymbol.create();
        deleteSymbol.type =
          taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA;
        deleteSymbol.id = this.formula.artifact?.artifactSymbol?.id || "";
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
          taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA;
        newArtifactRequest.artifact = this.packTemplateFormula(this.formula);
        await new Promise((resolve, reject) =>
          this.ttfConnection.createArtifact(
            newArtifactRequest,
            (error, response) => (error && reject(error)) || resolve(response)
          )
        );
      } else {
        const updateReqest = taxonomy.model.artifact.UpdateArtifactRequest.create();
        updateReqest.type =
          taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA;
        updateReqest.artifactTypeObject = this.packTemplateFormula(
          this.formula
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

  private async setFormulaDescription(description: string) {
    if (this.formula?.artifact?.artifactDefinition) {
      this.formula.artifact.artifactDefinition.businessDescription = description;
      await this.saveFormula(true);
    }
  }

  private updateIncompatibilities() {
    const newIncompatabilities: any = {};
    if (this.formula) {
      const allIds = [];
      allIds.push(this.formula.tokenBase?.base?.id);
      allIds.push(
        ...(this.formula.behaviors?.map((_) => _.behavior?.id) || [])
      );
      allIds.push(
        ...(this.formula.behaviorGroups?.map((_) => _.behaviorGroup?.id) || [])
      );
      allIds.push(
        ...(this.formula.propertySets?.map((_) => _.propertySet?.id) || [])
      );
      for (const id of allIds) {
        const artifact = this.ttfTaxonomy.getArtifcactById(id);
        if (artifact) {
          const artifactName = artifact.artifact?.name;
          for (const artifactIncompatibleWith of artifact.artifact
            ?.incompatibleWithSymbols || []) {
            if (artifactIncompatibleWith.id) {
              if (newIncompatabilities[artifactIncompatibleWith.id]) {
                newIncompatabilities[artifactIncompatibleWith.id].push(
                  artifactName
                );
              } else {
                newIncompatabilities[artifactIncompatibleWith.id] = [
                  artifactName,
                ];
              }
            }
          }
        }
      }
    }
    this.incompatabilities = newIncompatabilities;
  }

  private updateSymbol() {
    if (this.formula) {
      const tokenBaseTooling = this.formula.tokenBase?.base?.tooling || "?{}";
      const tokenBaseVisual = this.formula.tokenBase?.base?.visual || "?{}";
      let [tooling, includedBehaviorsTooling] = tokenBaseTooling
        .replace("}", "")
        .split("{", 2);
      let [visual, includedBehaviorsVisual] = tokenBaseVisual
        .replace("}", "")
        .split("{", 2);
      const behaviorsTooling = (includedBehaviorsTooling || "").split(",");
      const behaviorsVisual = (includedBehaviorsVisual || "").split(",");
      for (const behavior of this.formula.behaviors || []) {
        if (behaviorsTooling.indexOf(behavior.behavior?.tooling || "") === -1) {
          behaviorsTooling.push(behavior.behavior?.tooling || "?");
          behaviorsVisual.push(behavior.behavior?.visual || "?");
        }
      }
      for (const behaviorGroup of this.formula.behaviorGroups || []) {
        if (
          behaviorsTooling.indexOf(
            behaviorGroup.behaviorGroup?.tooling || ""
          ) === -1
        ) {
          behaviorsTooling.push(behaviorGroup.behaviorGroup?.tooling || "?");
          behaviorsVisual.push(behaviorGroup.behaviorGroup?.visual || "?");
        }
      }
      tooling += "{" + behaviorsTooling.join(",") + "}";
      visual += "{" + behaviorsVisual.join(",") + "}";
      let containsAdditions = false;
      for (const propertySet of this.formula.propertySets || []) {
        containsAdditions = true;
        tooling += "+" + (propertySet.propertySet?.tooling || "?");
        visual += "+" + (propertySet.propertySet?.visual || "?");
      }
      if (containsAdditions) {
        tooling = "[" + tooling + "]";
        visual = "[" + visual + "]";
      }
      if (this.formula.artifact) {
        if (this.formula.artifact.artifactSymbol) {
          this.formula.artifact.artifactSymbol.tooling = tooling;
          this.formula.artifact.artifactSymbol.visual = visual;
        }
        // By convention, formulae use their tooling symbol as their name:
        if (!this.formula.artifact || this.formula.artifact.name !== tooling) {
          this.formula.artifact.name = tooling;
          return true; // delete-and-create instead of update
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
}
