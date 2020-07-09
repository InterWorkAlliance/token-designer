import * as path from "path";
import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";

import { TokenTaxonomy } from "./tokenTaxonomy";

export class LeafIdentifier {
  constructor(
    public readonly parent: NodeIdentifier,
    public readonly extensionPath: string,
    public readonly toolingSymbol: string,
    public readonly label: string,
    public readonly description: string,
    public readonly id: string,
    public readonly type: ttfArtifact.ArtifactType
  ) {}

  public asTreeItem(): vscode.TreeItem {
    const result = new vscode.TreeItem(this.label);
    let iconPath = "token-base.svg";
    if (this.type === ttfArtifact.ArtifactType.BEHAVIOR) {
      iconPath = "behavior.svg";
    } else if (this.type === ttfArtifact.ArtifactType.BEHAVIOR_GROUP) {
      iconPath = "behavior-group.svg";
    } else if (this.type === ttfArtifact.ArtifactType.PROPERTY_SET) {
      iconPath = "property-set.svg";
    }
    result.iconPath = vscode.Uri.file(
      path.join(
        this.extensionPath,
        "resources",
        "token-designer",
        iconPath
      )
    );
    result.tooltip = this.description;
    if (this.type === ttfArtifact.ArtifactType.BEHAVIOR) {
      result.command = {
        title: "Open behavior",
        command: "visual-token-designer.openBehavior",
        arguments: [this.id],
      };
    } else if (this.type === ttfArtifact.ArtifactType.BEHAVIOR_GROUP) {
      result.command = {
        title: "Open behavior group",
        command: "visual-token-designer.openBehaviorGroup",
        arguments: [this.id],
      };
    } else if (this.type === ttfArtifact.ArtifactType.PROPERTY_SET) {
      result.command = {
        title: "Open property set",
        command: "visual-token-designer.openPropertySet",
        arguments: [this.id],
      };
    } else if (this.type === ttfArtifact.ArtifactType.BASE) {
      result.command = {
        title: "Open token base",
        command: "visual-token-designer.openTokenBase",
        arguments: [this.id],
      };
    }
    return result;
  }

  public get children(): (LeafIdentifier | NodeIdentifier)[] {
    return [];
  }
}

export class NodeIdentifier {
  constructor(
    public readonly label: string,
    public readonly children: (NodeIdentifier | LeafIdentifier)[]
  ) {}

  public asTreeItem(): vscode.TreeItem {
    const result = new vscode.TreeItem(
      this.label,
      vscode.TreeItemCollapsibleState.Collapsed
    );
    result.iconPath = vscode.ThemeIcon.Folder;
    return result;
  }

  public get parent(): LeafIdentifier | NodeIdentifier | undefined {
    return undefined;
  }
}

export class TokenArtifactExplorer
  implements vscode.TreeDataProvider<LeafIdentifier | NodeIdentifier> {
  private readonly onDidChangeTreeDataEmitter: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();

  public readonly onDidChangeTreeData: vscode.Event<void> = this
    .onDidChangeTreeDataEmitter.event;

  private disposed = false;

  private rootItems: NodeIdentifier[] = [];

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

  getTreeItem(element: LeafIdentifier | NodeIdentifier): vscode.TreeItem {
    return element.asTreeItem();
  }

  getChildren(
    element?: LeafIdentifier | NodeIdentifier
  ): (LeafIdentifier | NodeIdentifier)[] {
    if (element) {
      return element.children;
    } else {
      return this.rootItems;
    }
  }

  getParent(
    element: LeafIdentifier | NodeIdentifier
  ): NodeIdentifier | LeafIdentifier | undefined {
    return element.parent;
  }

  private createRootItem(
    nodeName: string,
    childType: ttfArtifact.ArtifactType,
    childArtifacts: (
      | ttfCore.Behavior.AsObject
      | ttfCore.BehaviorGroup.AsObject
      | ttfCore.PropertySet.AsObject
      | ttfCore.Base.AsObject
    )[]
  ): NodeIdentifier {
    const childIdentifiers: LeafIdentifier[] = [];
    const parent = new NodeIdentifier(nodeName, childIdentifiers);

    for (const _ of childArtifacts.filter(
      (_) => !!_.artifact?.artifactSymbol?.tooling
    )) {
      const leafIdentifier = new LeafIdentifier(
        parent,
        this.extensionPath,
        _.artifact?.artifactSymbol?.tooling as string,
        _.artifact?.name || (_.artifact?.artifactSymbol?.tooling as string),
        _.artifact?.artifactDefinition?.businessDescription || "",
        _.artifact?.artifactSymbol?.id || "",
        childType
      );
      childIdentifiers.push(leafIdentifier);
    }

    childIdentifiers.sort((a, b) => a.label.localeCompare(b.label));

    return parent;
  }

  private refresh() {
    if (this.ttfTaxonomy.taxonomy && !this.disposed) {
      const taxonomyObject = this.ttfTaxonomy.taxonomy.toObject();

      this.rootItems = [
        this.createRootItem(
          "Token Bases",
          ttfArtifact.ArtifactType.BASE,
          taxonomyObject.baseTokenTypesMap.map((_) => _[1])
        ),
        this.createRootItem(
          "Behaviors",
          ttfArtifact.ArtifactType.BEHAVIOR,
          taxonomyObject.behaviorsMap.map((_) => _[1])
        ),
        this.createRootItem(
          "Behaviors Groups",
          ttfArtifact.ArtifactType.BEHAVIOR_GROUP,
          taxonomyObject.behaviorGroupsMap.map((_) => _[1])
        ),
        this.createRootItem(
          "Property Sets",
          ttfArtifact.ArtifactType.PROPERTY_SET,
          taxonomyObject.propertySetsMap.map((_) => _[1])
        ),
      ];

      this.onDidChangeTreeDataEmitter.fire();
    }
  }
}
