import * as grpc from "grpc";
import * as path from "path";
import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfClient from "./ttf/service_grpc_pb";
import * as vscode from "vscode";

import { BehaviorPanel } from "./behaviorPanel";
import { BehaviorGroupPanel } from "./behaviorGroupPanel";
import { DefinitionPanel } from "./definitionPanel";
import { FormulaPanel } from "./formulaPanel";
import { HotReloadWatcher } from "./hotReloadWatcher";
import { ITtfInterface } from "./ttfInterface";
import { PropertySetPanel } from "./propertySetPanel";
import { TokenArtifactExplorer } from "./tokenArtifactExplorer";
import { TokenBasePanel } from "./tokenBasePanel";
import { TokenDefinitionExplorer } from "./tokenDefinitionExplorer";
import { TokenFormulaExplorer } from "./tokenFormulaExplorer";
import { TokenTaxonomy } from "./tokenTaxonomy";
import { TtfFileSystemConnection } from "./ttfFileSystemConnection";

const StatusBarPrefix = "$(debug-disconnect) TTF: ";

export async function activate(context: vscode.ExtensionContext) {
  let panelReloadEvent: vscode.Event<void> = new vscode.EventEmitter<void>()
    .event;
  if (process.env.VSCODE_DEBUG_MODE === "true") {
    const hotReloadWatcher = new HotReloadWatcher(context.extensionPath);
    context.subscriptions.push(hotReloadWatcher);
    panelReloadEvent = hotReloadWatcher.reload;
  }

  const newSandboxConnection = async () =>
    await TtfFileSystemConnection.create(
      path.join(
        context.extensionPath,
        "resources",
        "ttf_snapshot",
        "ttf_taxonomy.bin"
      )
    );

  let currentEnvironment = "Sandbox";
  let ttfConnection: ITtfInterface = await newSandboxConnection();
  let ttfTaxonomy = new TokenTaxonomy(ttfConnection);

  const tokenArtifactExplorer = new TokenArtifactExplorer(
    context.extensionPath,
    ttfTaxonomy
  );

  const tokenFormulaExplorer = new TokenFormulaExplorer(
    context.extensionPath,
    ttfTaxonomy
  );

  const tokenDefinitionExplorer = new TokenDefinitionExplorer(
    context.extensionPath,
    ttfTaxonomy
  );

  const changeEnvironmentCommand = vscode.commands.registerCommand(
    "visual-token-designer.changeEnvironment",
    async (commandContext) => {
      const newServer = await vscode.window.showInputBox({
        prompt:
          "Specifiy the address of the Token Taxonomy Framework GRPC server " +
          "to connect to (e.g. 127.0.0.1:8086). Leave blank to use the sandbox " +
          "(changes made in the sandbox are not persisted).",
        placeHolder: "Enter a hostname (leave blank for sandbox)",
        validateInput: (input) =>
          !input || input.match(/^[-a-z0-9.]+:[0-9]+$/i)
            ? null
            : "Please enter a valid hostname and port number (e.g. 127.0.0.1:8086). " +
              "Leave blank to use the sandbox.",
      });
      if (newServer) {
        ttfConnection = new ttfClient.ServiceClient(
          newServer,
          grpc.credentials.createInsecure()
        );
        currentEnvironment = newServer;
      } else {
        ttfConnection = await newSandboxConnection();
        currentEnvironment = "Sandbox";
      }
      ttfTaxonomy = new TokenTaxonomy(ttfConnection);
      tokenArtifactExplorer.setTaxonomy(ttfTaxonomy);
      tokenFormulaExplorer.setTaxonomy(ttfTaxonomy);
      tokenDefinitionExplorer.setTaxonomy(ttfTaxonomy);
      statusBarItem.text = StatusBarPrefix + currentEnvironment;
      statusBarItem.show();
    }
  );

  const createTokenFormulaCommand = vscode.commands.registerCommand(
    "visual-token-designer.createTokenFormula",
    async (commandContext) => {
      const panel = await FormulaPanel.openNewFormula(
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const openTokenFormulaCommand = vscode.commands.registerCommand(
    "visual-token-designer.openTokenFormula",
    async (commandContext) => {
      const panel = await FormulaPanel.openExistingFormula(
        commandContext,
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const createTokenDefinitionCommand = vscode.commands.registerCommand(
    "visual-token-designer.createTokenDefinition",
    async (commandContext) => {
      const panel = await DefinitionPanel.openNewDefinition(
        commandContext?.id || "",
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const createBehaviorGroupCommand = vscode.commands.registerCommand(
    "visual-token-designer.createBehaviorGroup",
    async () => {
      const panel = await BehaviorGroupPanel.createNewBehaviorGroup(
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const deleteArtifactCommand = vscode.commands.registerCommand(
    "visual-token-designer.deleteArtifact",
    async (commandContext) => {
      let typeAsString = "artifact";
      if (commandContext?.type === ttfArtifact.ArtifactType.BASE) {
        typeAsString = "token base";
      } else if (commandContext?.type === ttfArtifact.ArtifactType.BEHAVIOR) {
        typeAsString = "behavior";
      } else if (
        commandContext?.type === ttfArtifact.ArtifactType.BEHAVIOR_GROUP
      ) {
        typeAsString = "behavior group";
      } else if (
        commandContext?.type === ttfArtifact.ArtifactType.PROPERTY_SET
      ) {
        typeAsString = "property set";
      } else if (
        commandContext?.type === ttfArtifact.ArtifactType.TEMPLATE_DEFINITION
      ) {
        typeAsString = "token definition";
      } else if (
        commandContext?.type === ttfArtifact.ArtifactType.TEMPLATE_FORMULA
      ) {
        typeAsString = "token formula";
      } else if (
        commandContext?.type === ttfArtifact.ArtifactType.TOKEN_TEMPLATE
      ) {
        typeAsString = "token template";
      }
      if (
        commandContext?.id &&
        (await vscode.window.showWarningMessage(
          `Do you really want to delete this ${typeAsString}?`,
          "Yes",
          "No"
        )) === "Yes"
      ) {
        const deleteSymbol = new ttfArtifact.ArtifactSymbol();
        deleteSymbol.setType(commandContext?.type);
        deleteSymbol.setId(commandContext?.id);
        const deleteRequest = new ttfArtifact.DeleteArtifactRequest();
        deleteRequest.setArtifactSymbol(deleteSymbol);
        ttfConnection.deleteArtifact(deleteRequest, (err) => {
          if (err) {
            vscode.window.showErrorMessage(
              `There was a problem deleting this ${typeAsString}: ${err}`
            );
          }
          ttfTaxonomy.refresh();
        });
      }
    }
  );

  const createSmartContractEthCommand = vscode.commands.registerCommand(
    "visual-token-designer.createSmartContractEth",
    async (commandContext) => {
      vscode.window.showInformationMessage(
        "You are using a preview of the Visual Token Designer. Support for Ethereum smart contract " +
          "generation will be provided in a later release."
      );
    }
  );

  const createSmartContractNeoCommand = vscode.commands.registerCommand(
    "visual-token-designer.createSmartContractNeo",
    async (commandContext) => {
      vscode.window.showInformationMessage(
        "You are using a preview of the Visual Token Designer. Support for Neo smart contract " +
          "generation will be provided in a later release."
      );
    }
  );

  const openTokenDefinitionCommand = vscode.commands.registerCommand(
    "visual-token-designer.openTokenDefinition",
    async (commandContext) => {
      const panel = await DefinitionPanel.openExistingDefinition(
        commandContext,
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const openBehaviorCommand = vscode.commands.registerCommand(
    "visual-token-designer.openBehavior",
    async (commandContext) => {
      const panel = await BehaviorPanel.openExistingBehavior(
        commandContext,
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const openBehaviorGroupCommand = vscode.commands.registerCommand(
    "visual-token-designer.openBehaviorGroup",
    async (commandContext) => {
      const panel = await BehaviorGroupPanel.openExistingBehaviorGroup(
        commandContext,
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const openPropertySetCommand = vscode.commands.registerCommand(
    "visual-token-designer.openPropertySet",
    async (commandContext) => {
      const panel = await PropertySetPanel.openExistingPropertySet(
        commandContext,
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const openTokenBaseCommand = vscode.commands.registerCommand(
    "visual-token-designer.openTokenBase",
    async (commandContext) => {
      const panel = await TokenBasePanel.openExistingTokenBase(
        commandContext,
        ttfConnection,
        currentEnvironment,
        ttfTaxonomy,
        context.extensionPath,
        context.subscriptions,
        panelReloadEvent
      );
    }
  );

  const refreshTokenTaxonomyCommand = vscode.commands.registerCommand(
    "visual-token-designer.refreshTokenTaxonomy",
    async (commandContext) => {
      await ttfTaxonomy.refresh();
    }
  );

  const tokenArtifactExplorerProvider = vscode.window.registerTreeDataProvider(
    "visual-token-designer.tokenArtifactExplorer",
    tokenArtifactExplorer
  );

  const tokenFormulaExplorerProvider = vscode.window.registerTreeDataProvider(
    "visual-token-designer.tokenFormulaExplorer",
    tokenFormulaExplorer
  );

  const tokenDefinitionExplorerProvider = vscode.window.registerTreeDataProvider(
    "visual-token-designer.tokenDefinitionExplorer",
    tokenDefinitionExplorer
  );

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  statusBarItem.command = "visual-token-designer.changeEnvironment";
  statusBarItem.text = StatusBarPrefix + currentEnvironment;
  statusBarItem.show();

  context.subscriptions.push(changeEnvironmentCommand);
  context.subscriptions.push(createTokenFormulaCommand);
  context.subscriptions.push(createBehaviorGroupCommand);
  context.subscriptions.push(openTokenFormulaCommand);
  context.subscriptions.push(createTokenDefinitionCommand);
  context.subscriptions.push(deleteArtifactCommand);
  context.subscriptions.push(createSmartContractEthCommand);
  context.subscriptions.push(createSmartContractNeoCommand);
  context.subscriptions.push(openTokenDefinitionCommand);
  context.subscriptions.push(openBehaviorCommand);
  context.subscriptions.push(openBehaviorGroupCommand);
  context.subscriptions.push(openPropertySetCommand);
  context.subscriptions.push(openTokenBaseCommand);
  context.subscriptions.push(refreshTokenTaxonomyCommand);
  context.subscriptions.push(tokenArtifactExplorerProvider);
  context.subscriptions.push(tokenFormulaExplorerProvider);
  context.subscriptions.push(tokenDefinitionExplorerProvider);
  context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
