import * as fs from 'fs';
import * as vscode from 'vscode';

export class HotReloadWatcher {

    public readonly reload: vscode.Event<void>;

    private readonly reloadEmitter: vscode.EventEmitter<void>;
    private readonly fileSystemWatcher: fs.FSWatcher;

    private isDirty = false;
    private interval?: NodeJS.Timeout;

    constructor(extensionPath: string) {
        this.reloadEmitter = new vscode.EventEmitter<any>();
        this.reload = this.reloadEmitter.event;
        this.fileSystemWatcher = fs.watch(
            extensionPath + '/out/panels', 
            { persistent: false, recursive: true },
            (e, file) => this.changeDetected(file));
        this.interval = setInterval(this.fireEventIfNeeded.bind(this), 1000);
    }

    public dispose() {
        this.fileSystemWatcher.close();
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    private changeDetected(file: string) {
        console.info('Change detected', file);
        this.isDirty = true;
    }

    private fireEventIfNeeded() {
        if (this.isDirty) {
            console.log('Triggering hot reload');
            this.reloadEmitter.fire();
            this.isDirty = false;
        }
    }

}