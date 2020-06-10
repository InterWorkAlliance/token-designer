# Visual Token Designer

This is a Visual Studio Code extension that facilitates manipulation of artifacts in the [Token Taxonomy Framework](https://github.com/interwork-alliance/TokenTaxonomyFramework).

The extension provides a sandbox environment that allows you to explore the various artifacts in the taxonomy as well as the ability to connect to an instance of the [Taxonomy Service](https://github.com/interwork-alliance/TokenTaxonomyFramework/tree/master/tools) to contribute to the taxonomy. 

## Features

After [installing the extension](https://github.com/ngdseattle/visual-token-designer/wiki/Early-BETA-tester-instructions) you will see a new icon in the Visual Studio Code Activity Bar.  Click on this icon to access the Visual Token Designer.

![Activity bar icon](https://github.com/ngdseattle/visual-token-designer/blob/docs/screenshots/activity-bar-icon.png?raw=true)

On the left of the window you will see various tree views that allow you to navigate the taxonomy.  Clicking on one of the items will launch a panel that allows you to inspect/edit it.

### Editing a base artifact

_Note: The user interface for this functionality is under development. Currently you will see the JSON representation of the artifact._

![Editing an artifact](https://github.com/ngdseattle/visual-token-designer/blob/docs/screenshots/edit-artifact.png?raw=true)

### Editing a Formula

In this view you can edit a formula using drag and drop gestures: 

- To add an artifact to the formula, drag the corresponding artifact from any of the toolboxes to the main canvas. 
- To remove an artifact, drag it off of the canvas and drop it in any of the toolboxes.

As you add and remove artifacts, the tooling symbol for the formula will be automatically updated (this can be seen in the lower-right portion of the canvas). 

If you add an incompatible combination of artifacts, the error will be highlighted in Red.

You can edit the formula description by typing in the region at the lower-left corner of the canvas.

![Editing a formula](https://github.com/ngdseattle/visual-token-designer/blob/docs/screenshots/edit-formula.png?raw=true)

### Editing a Definition

In this view you can view and edit an existing token defintion. Click on any individual artifact in the definition to view more infomration about that portion of the token definition in the preview pane at the right edge of the panel.

_Note: The user interface for this functionality is under development. Currently the view is read-only and property values cannot yet be set._

![Editing a definition](https://github.com/ngdseattle/visual-token-designer/blob/docs/screenshots/view-definition.png?raw=true)

### Creating new artifacts

The **Token formulae** tree view provides an option to create a new formula:

![Creating a new formula](https://github.com/ngdseattle/visual-token-designer/blob/docs/screenshots/create-formula-menu.png?raw=true)

To create a new **Token definitions** right click on any existing formula and choose to create a new Token Definition from that formula:

![Creating a new definition](https://github.com/ngdseattle/visual-token-designer/blob/docs/screenshots/create-definition-menu.png?raw=true)


