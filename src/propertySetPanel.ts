import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as vscode from "vscode";

import { ArtifactPanelBase } from "./artifactPanelBase";
import { BehaviorPanel } from "./behaviorPanel";
import { ITtfInterface } from "./ttfInterface";
import { propertySetPanelEvents } from "./panels/propertySetPanelEvents";
import { TokenTaxonomy } from "./tokenTaxonomy";

export class PropertySetPanel extends ArtifactPanelBase<ttfCore.PropertySet> {
  static async createNewPropertySet(
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new PropertySetPanel(
      ttfConnection,
      environment,
      ttfTaxonomy,
      extensionPath,
      disposables,
      panelReloadEvent
    );
    const newObject = new ttfCore.PropertySet();
    newObject.setRepresentationType(ttfArtifact.RepresentationType.COMMON);
    return await ArtifactPanelBase.createNew(
      ttfConnection,
      ttfTaxonomy,
      panel,
      newObject,
      "taxonomy.model.core.PropertySet",
      ttfArtifact.ArtifactType.PROPERTY_SET
    );
  }

  static async openExistingPropertySet(
    artifactId: string,
    ttfConnection: ITtfInterface,
    environment: string,
    ttfTaxonomy: TokenTaxonomy,
    extensionPath: string,
    disposables: vscode.Disposable[],
    panelReloadEvent: vscode.Event<void>
  ) {
    const panel = new PropertySetPanel(
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
      "taxonomy.model.core.PropertySet",
      environment,
      ttfTaxonomy,
      "Property Set",
      "property-set.svg",
      "propertySetPanel",
      "propertySetPanel.main.js",
      extensionPath,
      disposables,
      panelReloadEvent
    );
  }

  protected async onUnhandledMessage(message: any) {
    if (message.e === propertySetPanelEvents.AddProperty) {
      const newPropertyName = await vscode.window.showInputBox({
        prompt: "Enter a name for the new property",
      });
      if (newPropertyName) {
        const newProperty = new ttfCore.Property();
        newProperty.setName(newPropertyName);
        this.artifact?.addProperties(newProperty);
        await this.saveChanges();
      }
    } else if (message.e === propertySetPanelEvents.EditPropertyDescription) {
      await PropertySetPanel.DoOnProperty(
        this.artifact?.getPropertiesList(),
        message.path,
        async (property) => {
          const newDescription = await vscode.window.showInputBox({
            prompt: "Enter the property description",
            value: property.getValueDescription(),
          });
          if (newDescription) {
            property.setValueDescription(newDescription);
            await this.saveChanges();
          }
        }
      );
    } else if (message.e === propertySetPanelEvents.EditPropertyName) {
      await PropertySetPanel.DoOnProperty(
        this.artifact?.getPropertiesList(),
        message.path,
        async (property) => {
          const newName = await vscode.window.showInputBox({
            prompt: "Enter the property name",
            value: property.getName(),
          });
          if (newName) {
            property.setName(newName);
            await this.saveChanges();
          }
        }
      );
    } else if (message.e === propertySetPanelEvents.EditPropertyValue) {
      await PropertySetPanel.DoOnProperty(
        this.artifact?.getPropertiesList(),
        message.path,
        async (property) => {
          const newValue = await vscode.window.showInputBox({
            prompt: "Enter the property value",
            value: property.getTemplateValue(),
          });
          if (newValue) {
            property.setTemplateValue(newValue);
            await this.saveChanges();
          }
        }
      );
    } else if (message.e === propertySetPanelEvents.DeleteProperty) {
      await PropertySetPanel.DeleteProperty(this.artifact, message.path);
      await this.saveChanges();
    } else if (message.e === propertySetPanelEvents.EditInvocation) {
      const newInvocation = BehaviorPanel.buildInvocation(message.invocation);
      const i = message.i;
      await PropertySetPanel.DoOnProperty(
        this.artifact?.getPropertiesList(),
        message.path,
        async (property) => {
          if (i >= property.getPropertyInvocationsList().length) {
            property.addPropertyInvocations(newInvocation);
          } else {
            property.getPropertyInvocationsList()[i] = newInvocation;
          }
          await this.saveChanges();
        }
      );
    } else if (message.e === propertySetPanelEvents.DeleteInvocation) {
      const i = message.i;
      await PropertySetPanel.DoOnProperty(
        this.artifact?.getPropertiesList(),
        message.path,
        async (property) => {
          property.setPropertyInvocationsList(
            property.getPropertyInvocationsList().filter((_, j) => j !== i)
          );
          await this.saveChanges();
        }
      );
    }
  }

  protected async getArtifact(
    symbol: ttfArtifact.ArtifactSymbol
  ): Promise<ttfCore.PropertySet> {
    return await new Promise((resolve, reject) =>
      this.ttfConnection.getPropertySetArtifact(
        symbol,
        (error, response) => (error && reject(error)) || resolve(response)
      )
    );
  }

  private static async DoOnProperty(
    properties: ttfCore.Property[] | undefined,
    path: string[],
    action: (property: ttfCore.Property) => Promise<void>
  ) {
    if (!properties || !properties.length || !path || !path.length) {
      return;
    }
    const property = properties.filter((_) => _.getName() === path[0])[0];
    if (!property) {
      return;
    }
    if (path.length === 1) {
      await action(property);
    } else {
      await PropertySetPanel.DoOnProperty(
        property.getPropertiesList(),
        path.slice(1),
        action
      );
    }
  }

  private static async DeleteProperty(
    parent:
      | {
          getPropertiesList: () => ttfCore.Property[] | undefined;
          setPropertiesList: (newList: ttfCore.Property[]) => void;
        }
      | undefined
      | null,
    path: string[]
  ) {
    if (!parent || !path || !path.length) {
      return;
    }
    const properties = parent.getPropertiesList();
    if (!properties) {
      return;
    }
    if (path.length === 1) {
      parent.setPropertiesList(
        properties.filter((_) => _.getName() !== path[0])
      );
    } else {
      const property = properties.filter((_) => _.getName() === path[0])[0];
      await PropertySetPanel.DeleteProperty(property, path.slice(1));
    }
  }
}
