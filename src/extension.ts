import * as grpc from 'grpc';
import * as ttfClient from './ttf/service_grpc_pb';
import * as vscode from 'vscode';

import { TokenTaxonomy } from './tokenTaxonomy';

export function activate(context: vscode.ExtensionContext) {

	const ttfConnection = new ttfClient.ServiceClient('127.0.0.1:8086', grpc.credentials.createInsecure());

    const ttfTaxonomy = new TokenTaxonomy(ttfConnection);

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	
}
