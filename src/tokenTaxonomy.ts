import * as vscode from 'vscode';

import * as ttfTaxonomy from './ttf/taxonomy_pb';

import { ITaxonomy, IServiceClient } from './ttfInterface';

export class TokenTaxonomy {

    private readonly onRefreshEmitter: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();

    public readonly onRefresh: vscode.Event<void> = this.onRefreshEmitter.event;

    private latestTaxonomy: ITaxonomy | null = null;

    get taxonomy(): ITaxonomy | null {
        return this.latestTaxonomy;
    }

    constructor(private readonly ttfConnection: IServiceClient) {
        this.refresh();
    }

    public async refresh() {
        const version = new ttfTaxonomy.TaxonomyVersion();
        version.setVersion('1.0');
        this.latestTaxonomy = await new Promise(
            (resolve, reject) => this.ttfConnection.getFullTaxonomy(version, (error, response) => error ? reject(error) : resolve(response)));
        this.onRefreshEmitter.fire();
    }
}