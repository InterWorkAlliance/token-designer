import * as path from "path";
import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfTaxonomy from "./ttf/taxonomy_pb";
import * as vscode from "vscode";

import { TokenTaxonomy } from "./tokenTaxonomy";

export class TokenDefinitionIdentifier {
  static create(
    extensionPath: string,
    label: string,
    parent: TokenDefinitionIdentifier | undefined,
    dataSource: any
  ) {
    const children: TokenDefinitionIdentifier[] = [];
    const result = new TokenDefinitionIdentifier(
      extensionPath,
      label,
      parent,
      dataSource?.artifact
    );
    if (dataSource?.fungibles) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Fungibles",
          result,
          dataSource.fungibles
        )
      );
    }
    if (dataSource?.nonFungibles) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Non-fungibles",
          result,
          dataSource.nonFungibles
        )
      );
    }
    if (dataSource?.hybrids) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Hybrids",
          result,
          dataSource.hybrids
        )
      );
    }
    if (dataSource?.fungible) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Fungible",
          result,
          dataSource.fungible
        )
      );
    }
    if (dataSource?.nonFungible) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Non-fungible",
          result,
          dataSource.nonFungible
        )
      );
    }
    if (dataSource?.fractional) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Fractional",
          result,
          dataSource.fractional
        )
      );
    }
    if (dataSource?.whole) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Whole",
          result,
          dataSource.whole
        )
      );
    }
    if (dataSource?.singleton) {
      children.push(
        TokenDefinitionIdentifier.create(
          extensionPath,
          "Singleton",
          result,
          dataSource.singleton
        )
      );
    }
    if (dataSource?.name && dataSource?.branchesList) {
      for (const branch of dataSource.branchesList) {
        children.push(
          TokenDefinitionIdentifier.create(
            extensionPath,
            dataSource.name,
            result,
            branch
          )
        );
      }
    }
    if (dataSource?.templates?.templateMap) {
      for (const mapItem of dataSource.templates.templateMap) {
        if (mapItem[1]?.definition) {
          children.push(
            TokenDefinitionIdentifier.create(
              extensionPath,
              mapItem[1].definition.artifact?.name || "Unknown",
              result,
              mapItem[1].definition
            )
          );
        }
      }
    }
    result.children = children.sort((a, b) => a.label.localeCompare(b.label));
    return result;
  }

  children: TokenDefinitionIdentifier[] = [];

  public readonly type = ttfArtifact.ArtifactType.TEMPLATE_DEFINITION;

  public readonly id: string;

  private constructor(
    public readonly extensionPath: string,
    public readonly label: string,
    public readonly parent: TokenDefinitionIdentifier | undefined,
    public readonly artifact?: ttfArtifact.Artifact.AsObject
  ) {
    this.id = artifact?.artifactSymbol?.id || "";
  }

  public asTreeItem(): vscode.TreeItem {
    const result = new vscode.TreeItem(
      this.label,
      this.children?.length
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None
    );
    result.iconPath = this.artifact
      ? vscode.Uri.file(
          path.join(
            this.extensionPath,
            "resources",
            "token-designer",
            "token-base.svg"
          )
        )
      : vscode.ThemeIcon.Folder;
    result.tooltip = this.artifact?.artifactDefinition?.businessDescription;
    if (this.artifact) {
      result.command = {
        title: "Open definition",
        command: "visual-token-designer.openTokenDefinition",
        arguments: [this.artifact?.artifactSymbol?.id],
      };
    }
    return result;
  }
}

export class TokenDefinitionExplorer
  implements vscode.TreeDataProvider<TokenDefinitionIdentifier> {
  private readonly onDidChangeTreeDataEmitter: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();

  public readonly onDidChangeTreeData: vscode.Event<void> = this
    .onDidChangeTreeDataEmitter.event;

  private disposed = false;

  private hierarchy: ttfTaxonomy.Hierarchy.AsObject | undefined = undefined;

  private ttfTaxonomy: TokenTaxonomy;

  constructor(
    private readonly extensionPath: string,
    ttfTaxonomy: TokenTaxonomy
  ) {
    this.ttfTaxonomy = ttfTaxonomy;
    this.setTaxonomy(ttfTaxonomy);
  }

  setTaxonomy(ttfTaxonomy: TokenTaxonomy) {
    this.ttfTaxonomy = ttfTaxonomy;
    this.refresh();
    this.ttfTaxonomy.onRefresh(this.refresh, this);
  }

  dispose() {
    this.disposed = true;
  }

  getTreeItem(element: TokenDefinitionIdentifier): vscode.TreeItem {
    return element.asTreeItem();
  }

  getChildren(
    element?: TokenDefinitionIdentifier
  ): TokenDefinitionIdentifier[] {
    if (element) {
      return element.children;
    } else if (this.hierarchy) {
      return this.getChildren(
        TokenDefinitionIdentifier.create(
          this.extensionPath,
          "Token definitions",
          undefined,
          this.hierarchy
        )
      );
    } else {
      return [];
    }
  }

  getParent(element: TokenDefinitionIdentifier) {
    return element?.parent;
  }

  private refresh() {
    if (this.ttfTaxonomy.taxonomy && !this.disposed) {
      this.hierarchy = this.ttfTaxonomy.taxonomy.toObject().tokenTemplateHierarchy;
      this.onDidChangeTreeDataEmitter.fire();
    }
  }
}
