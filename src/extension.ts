import * as grpc from 'grpc';
import * as ttfClient from './ttf/service_grpc_pb';
import * as vscode from 'vscode';

import { TokenDefinitionExplorer } from './tokenDefinitionExplorer';
import { TokenDesignerPanel } from './tokenDesignerPanel';
import { TokenFormulaExplorer } from './tokenFormulaExplorer';
import { TokenTaxonomy } from './tokenTaxonomy';

export function activate(context: vscode.ExtensionContext) {

	const ttfConnection = new ttfClient.ServiceClient('127.0.0.1:8086', grpc.credentials.createInsecure());

    const ttfTaxonomy = new TokenTaxonomy(ttfConnection);

	const tokenFormulaExplorer = new TokenFormulaExplorer(context.extensionPath, ttfTaxonomy);

    const tokenDefinitionExplorer = new TokenDefinitionExplorer(context.extensionPath, ttfTaxonomy);

	const createTokenFormulaCommand = vscode.commands.registerCommand('visual-token-designer.createTokenFormula', async (commandContext) => {
        const panel = await TokenDesignerPanel.openNewFormula(ttfConnection, ttfTaxonomy, context.extensionPath, context.subscriptions);
    });

    const openTokenFormulaCommand = vscode.commands.registerCommand('visual-token-designer.openTokenFormula', async (commandContext) => {
        const panel = await TokenDesignerPanel.openExistingFormula(commandContext, ttfConnection, ttfTaxonomy, context.extensionPath, context.subscriptions);
    });

    const createTokenDefinitionCommand = vscode.commands.registerCommand('visual-token-designer.createTokenDefinition', async (commandContext) => {
        const panel = await TokenDesignerPanel.openNewDefinition(commandContext?.id || '', ttfConnection, ttfTaxonomy, context.extensionPath, context.subscriptions);
    });

    const openTokenDefinitionCommand = vscode.commands.registerCommand('visual-token-designer.openTokenDefinition', async (commandContext) => {
        const panel = await TokenDesignerPanel.openExistingDefinition(commandContext, ttfConnection, ttfTaxonomy, context.extensionPath, context.subscriptions);
    });

    const refreshTokenTaxonomyCommand = vscode.commands.registerCommand('visual-token-designer.refreshTokenTaxonomy', async (commandContext) => {
        await ttfTaxonomy.refresh();
    });

    const tokenFormulaExplorerProvider = vscode.window.registerTreeDataProvider('visual-token-designer.tokenFormulaExplorer', tokenFormulaExplorer);

	const tokenDefinitionExplorerProvider = vscode.window.registerTreeDataProvider('visual-token-designer.tokenDefinitionExplorer', tokenDefinitionExplorer);

    context.subscriptions.push(createTokenFormulaCommand);
    context.subscriptions.push(openTokenFormulaCommand);
    context.subscriptions.push(createTokenDefinitionCommand);
    context.subscriptions.push(openTokenDefinitionCommand);
    context.subscriptions.push(refreshTokenTaxonomyCommand);
    context.subscriptions.push(tokenFormulaExplorerProvider);
	context.subscriptions.push(tokenDefinitionExplorerProvider);
		
}

export function deactivate() {
	
}
