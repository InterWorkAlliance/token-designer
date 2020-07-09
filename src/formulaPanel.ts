import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as uuid from "uuid";
import * as vscode from "vscode";
import * as protobufAny from "google-protobuf/google/protobuf/any_pb";

import { formulaPanelEvents } from "./panels/formulaPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { PanelBase } from "./panelBase";
import { TaxonomyAsObjects } from "./panels/taxonomyAsObjects";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class FormulaPanel extends PanelBase {
  
  private taxonomyObjects: TaxonomyAsObjects | null = null;

  private formula: ttfCore.TemplateFormula | null = null;

  private incompatabilities: any = {};

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
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    super(
      "formulaPanel",
      "formulaPanel.main.js",
      extensionPath,
      disposables,
      panelReloadEvent
    );
    this.setTitle(this.title(), "unknown.svg");
    this.refreshTaxonomy();
    this.ttfTaxonomy.onRefresh(this.refreshTaxonomy, this);
  }

  async onMessage(message: any) {
    if (message.e === formulaPanelEvents.Init) {
      this.postMessage({
        formula: this.formula?.toObject(),
        taxonomy: this.taxonomyObjects,
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

  private title() {
    const suffix = " - " + this.environment;
    if (this.formula) {
      return (
        (this.formula.getArtifact()?.getName() || "New formula") +
        " - Token Formula" +
        suffix
      );
    } else {
      return "Token Designer" + suffix;
    }
  }

  private async addArtifact(id: string) {
    const toAdd = this.ttfTaxonomy.getArtifcactById(id);
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

  private async newFormula() {
    const id = uuid.v1();
    const temporaryTooling = "Untitled";
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

  private packTemplateFormula(formula: ttfCore.TemplateFormula) {
    const any = new protobufAny.Any();
    any.pack(formula.serializeBinary(), "taxonomy.model.core.TemplateFormula");
    return any;
  }

  private async refreshFormula(symbol?: string) {
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
    this.postMessage({
      definition: null,
      formula: this.formula?.toObject() || null,
      incompatabilities: this.incompatabilities,
    });
    this.setTitle(this.title());
    await this.ttfTaxonomy.refresh();
  }

  private async refreshTaxonomy() {
    this.taxonomyObjects = this.ttfTaxonomy.asObjects();
    this.postMessage({ taxonomy: this.taxonomyObjects });
  }

  private async removeArtifact(id: string, save: boolean = true) {
    const toRemove = this.ttfTaxonomy.getArtifcactById(id);
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
        const artifact = this.ttfTaxonomy.getArtifcactById(id);
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
