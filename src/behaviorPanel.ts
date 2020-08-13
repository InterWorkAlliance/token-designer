import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { behaviorPanelEvents } from "./panels/behaviorPanelEvents";
import { ITtfInterface } from "./ttfInterface";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class BehaviorPanel extends ArtifactPanelBase<ttfCore.Behavior> {
  static async createNewBehavior(
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
    return await ArtifactPanelBase.createNew(
      ttfConnection,
      ttfTaxonomy,
      panel,
      new ttfCore.Behavior(),
      "taxonomy.model.core.Behavior",
      ttfArtifact.ArtifactType.BEHAVIOR
    );
  }

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
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    super(
      ttfConnection,
      "taxonomy.model.core.Behavior",
      environment,
      ttfTaxonomy,
      "Behavior",
      "behavior.svg",
      "behaviorPanel",
      "behaviorPanel.main.js",
      extensionPath,
      disposables,
      panelReloadEvent
    );
  }

  protected async onUnhandledMessage(message: any) {
    if (message.e === behaviorPanelEvents.EditConstructorType) {
      const newConstructorType = await vscode.window.showInputBox({
        prompt: "Constructor type",
        value: this.artifact?.getConstructorType(),
      });
      if (newConstructorType || newConstructorType === "") {
        this.artifact?.setConstructorType(newConstructorType || "");
        await this.saveChanges();
      }
    } else if (message.e === behaviorPanelEvents.EditInvocation) {
      if (!this.artifact) {
        return;
      }
      const newInvocation = this.buildInvocation(message.invocation);
      const i = message.i;
      if (i >= this.artifact.getInvocationsList().length) {
        this.artifact.addInvocations(newInvocation);
      } else {
        this.artifact.getInvocationsList()[i] = newInvocation;
      }
      await this.saveChanges();
    } else if (message.e === behaviorPanelEvents.EditPropertyInvocation) {
      if (!this.artifact) {
        return;
      }
      const pi = message.pi;
      if (pi >= this.artifact.getPropertiesList().length) {
        return;
      }
      const newInvocation = this.buildInvocation(message.invocation);
      const i = message.i;
      const property = this.artifact.getPropertiesList()[pi];
      if (i >= property.getPropertyInvocationsList().length) {
        property.addPropertyInvocations(newInvocation);
      } else {
        property.getPropertyInvocationsList()[i] = newInvocation;
      }
      await this.saveChanges();
    }
  }

  protected async getArtifact(
    symbol: ttfArtifact.ArtifactSymbol
  ): Promise<ttfCore.Behavior> {
    return await new Promise((resolve, reject) =>
      this.ttfConnection.getBehaviorArtifact(
        symbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
  }

  private buildInvocation(data: any) {
    const newInvocation = new ttfCore.Invocation();
    newInvocation.setId(data.id || "");
    newInvocation.setName(data.name || "");
    newInvocation.setDescription(data.description || "");
    if (
      data.request?.controlMessageName ||
      data.request?.description ||
      data.request?.inputParametersList?.length
    ) {
      const newRequest = new ttfCore.InvocationRequest();
      newRequest.setControlMessageName(data.request.controlMessageName || "");
      newRequest.setDescription(data.request.description || "");
      const parameters: ttfCore.InvocationParameter[] = [];
      for (const parameterData of data.request.inputParametersList || []) {
        const parameter = new ttfCore.InvocationParameter();
        parameter.setName(parameterData.name || "");
        parameter.setValueDescription(parameterData.valueDescription || "");
        parameters.push(parameter);
      }
      newRequest.setInputParametersList(parameters);
      newInvocation.setRequest(newRequest);
    }
    if (
      data.response?.controlMessageName ||
      data.response?.description ||
      data.response?.outputParametersList?.length
    ) {
      const newResponse = new ttfCore.InvocationResponse();
      newResponse.setControlMessageName(data.response.controlMessageName || "");
      newResponse.setDescription(data.response.description || "");
      const parameters: ttfCore.InvocationParameter[] = [];
      for (const parameterData of data.response.outputParametersList || []) {
        const parameter = new ttfCore.InvocationParameter();
        parameter.setName(parameterData.name || "");
        parameter.setValueDescription(parameterData.valueDescription || "");
        parameters.push(parameter);
      }
      newResponse.setOutputParametersList(parameters);
      newInvocation.setResponse(newResponse);
    }
    return newInvocation;
  }
}
