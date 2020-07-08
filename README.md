# Visual Token Designer for Visual Studio Code

This is a Visual Studio Code extension that facilitates manipulation of artifacts in the [Token Taxonomy Framework](https://github.com/interwork-alliance/TokenTaxonomyFramework).

## Token Taxonomy Framework

The Token Taxonomy Framework bridges the gap between blockchain developers, line of business executives and legal/regulators allowing them to work together to model existing and define new business models and networks based on tokens.

The framework's goals include:

* Define a common set of concepts and terms that can be used by business, technical, and regulatory participants to speak the same language.
* Produce token definitions that have clear and understood requirements that are implementation neutral for developers to follow and standards organizations to validate.
* Establish a base Token Classification Hierarchy (TCH) driven by metadata that is simple to understand and navigate for anyone interested in learning and discovering Tokens and underlying implementations.

## Visual Token Designer

The extension provides a sandbox environment that allows you to explore the various artifacts in the taxonomy as well as the ability to connect to an instance of the [Taxonomy Service](https://github.com/interwork-alliance/TokenTaxonomyFramework/tree/master/tools) to contribute to the taxonomy.

The Visual Token Designer's features include: 

* Deliver tooling meta-data using the TTF syntax that enables the generation of visual representations of classifications, and modelling tools to view and create token definitions mapped to the taxonomy.
* Produce standard artifacts and control message descriptions mapped to the taxonomy that are implementation neutral and provide base components and controls that consortia, startups, platforms or regulators can use to work together.
* Encourage differentiation and vertical specialization while maintaining an interoperable base.
* Include a sandbox environment for legal and regulatory requirement discovery and input
* Be used in taxonomy workshops for defining existing or new tokens which results in a contribution back to the framework to organically grow and expand across industries for maximum re-use.

## Usage

After installing the extension, you will see a new icon in the Visual Studio Code Activity Bar.  Click on this icon to access the Visual Token Designer.

![Activity bar icon](https://github.com/ngdseattle/visual-token-designer/blob/master/screenshots/activity-bar-icon.png?raw=true)

On the left of the window you will see various tree views that allow you to navigate the taxonomy.  Clicking on one of the items will launch a panel that allows you to inspect/edit it.

### Editing a base artifact

_Note: The user interface for this functionality is under development. Currently you will see the JSON representation of the artifact._

![Editing an artifact](https://github.com/ngdseattle/visual-token-designer/blob/master/screenshots/edit-artifact.png?raw=true)

### Editing a Formula

In this view you can edit a formula using drag and drop gestures: 

- To add an artifact to the formula, drag the corresponding artifact from any of the toolboxes to the main canvas. 
- To remove an artifact, drag it off of the canvas and drop it in any of the toolboxes.

As you add and remove artifacts, the tooling symbol for the formula will be automatically updated (this can be seen in the lower-right portion of the canvas). 

If you add an incompatible combination of artifacts, the error will be highlighted in Red.

You can edit the formula description by typing in the region at the lower-left corner of the canvas.

![Editing a formula](https://github.com/ngdseattle/visual-token-designer/blob/master/screenshots/edit-formula.png?raw=true)

### Editing a Definition

In this view you can view and edit an existing token defintion. Click on any individual artifact in the definition to view more infomration about that portion of the token definition in the preview pane at the right edge of the panel.

_Note: The user interface for this functionality is under development. Currently the view is read-only and property values cannot yet be set._

![Editing a definition](https://github.com/ngdseattle/visual-token-designer/blob/master/screenshots/view-definition.png?raw=true)

### Creating new artifacts

The **Token formulae** tree view provides an option to create a new formula:

![Creating a new formula](https://github.com/ngdseattle/visual-token-designer/blob/master/screenshots/create-formula-menu.png?raw=true)

To create a new **Token definitions** right click on any existing formula and choose to create a new Token Definition from that formula:

![Creating a new definition](https://github.com/ngdseattle/visual-token-designer/blob/master/screenshots/create-definition-menu.png?raw=true)
