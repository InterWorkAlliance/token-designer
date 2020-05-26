import { htmlHelpers } from "./htmlHelpers";
import { tokenDesignerEvents } from "./tokenDesignerEvents";
import { TokenDesignerTaxonomy } from "./tokenDesignerTaxonomy";

type toolboxArtifact = 
    ttfCore.Base.AsObject | 
    ttfCore.PropertySet.AsObject | 
    ttfCore.Behavior.AsObject | 
    ttfCore.BehaviorGroup.AsObject;

declare var acquireVsCodeApi: any;

class Dom {
    canvas = document.getElementById('canvas') as HTMLElement;
    canvasTokenBase = document.getElementById('canvasTokenBase') as HTMLElement;
    behaviorsArea = document.getElementById('behaviorsArea') as HTMLElement;
    descriptionInput = document.getElementById('descriptionInput') as HTMLTextAreaElement;
    formula = document.getElementById('formula') as HTMLElement;
    inspector = document.getElementById('inspector') as HTMLElement;
    inspectorDescription = document.getElementById('inspectorDescription') as HTMLElement;
    inspectorHelp = document.getElementById('inspectorHelp') as HTMLElement;
    inspectorTitle = document.getElementById('inspectorTitle') as HTMLElement;
    inspectorPropertiesTable = document.getElementById('inspectorPropertiesTable') as HTMLElement;
    inspectorPropertiesList = document.getElementById('inspectorPropertiesList') as HTMLElement;
    nameInput = document.getElementById('nameInput') as HTMLInputElement;
    propertiesHeading = document.getElementById('propertiesHeading') as HTMLElement;
}

let dom: Dom;
let artifactBeingDraggedOn: toolboxArtifact | undefined = undefined;
let artifactBeingDraggedOff: toolboxArtifact | undefined = undefined;
let artifactSelected: toolboxArtifact | undefined = undefined;
let draggingInspector: DragEvent | undefined = undefined;
let incompatabilities: any = {};
let taxonomy: TokenDesignerTaxonomy | undefined = undefined;
let tokenDefinition: ttfCore.TemplateDefinition.AsObject | undefined = undefined;
let tokenFormula: ttfCore.TemplateFormula.AsObject | undefined = undefined;
let vsCodePostMessage: Function;

function addToTokenDesign() {
    if (tokenFormula && artifactBeingDraggedOn) {
        vsCodePostMessage({ e: tokenDesignerEvents.Add, id: artifactBeingDraggedOn.artifact?.artifactSymbol?.id });
        artifactBeingDraggedOn = undefined;
    }
}

function createInvalidToolElement() {
    const icon = document.createElement('img');
    icon.src = 'token-designer/unknown.svg';
    icon.className = 'icon';
    const title = document.createElement('div');
    title.innerText = '(Unknown)';
    title.className = 'title';
    const element = document.createElement('span');
    element.className = 'toolElement';
    element.title = title.innerText;
    element.appendChild(icon);
    element.appendChild(title);
    return element;
}

function createToolElement(
    taxonomyArtifactId: string | undefined,
    isInToolbox: boolean,
    dragEnabled: boolean) {

    let imgSrc = 'token-designer/unknown.svg';
    let taxonomyArtifact: toolboxArtifact | undefined = undefined;
    taxonomyArtifact = taxonomy?.baseTokenTypes.find(_ => _.artifact?.artifactSymbol?.id === taxonomyArtifactId);
    if (taxonomyArtifact) {
        imgSrc = 'token-designer/token-base.svg';
    } else {
        taxonomyArtifact = taxonomy?.propertySets.find(_ => _.artifact?.artifactSymbol?.id === taxonomyArtifactId);
        if (taxonomyArtifact) {
            imgSrc = 'token-designer/property-set.svg';
        } else {
            taxonomyArtifact = taxonomy?.behaviors.find(_ => _.artifact?.artifactSymbol?.id === taxonomyArtifactId);
            if (taxonomyArtifact) {
                imgSrc = 'token-designer/behavior.svg';
            } else {
                taxonomyArtifact = taxonomy?.behaviorGroups.find(_ => _.artifact?.artifactSymbol?.id === taxonomyArtifactId);
                if (taxonomyArtifact) {
                    imgSrc = 'token-designer/behavior-group.svg';
                }
            }
        }
    }

    const icon = document.createElement('img');
    icon.src = imgSrc;
    icon.className = 'icon';
    const title = document.createElement('div');
    title.innerText = taxonomyArtifact?.artifact?.name || '(Unknown)';
    title.className = 'title';
    const element = document.createElement('span');
    element.className = 'toolElement ' + 
        (artifactSelected?.artifact?.artifactSymbol?.id === taxonomyArtifact?.artifact?.artifactSymbol?.id ? 'selected' : '');
    element.title = title.innerText;
    element.draggable = dragEnabled;
    element.appendChild(icon);
    element.appendChild(title);
    if (isInToolbox) {
        if (dragEnabled) {
            element.ondragstart = () => {
                artifactBeingDraggedOff = undefined;
                artifactBeingDraggedOn = taxonomyArtifact;
            };
        } else {
            element.className += ' disabled';
        }
    } else {
        if (dragEnabled) {
            element.ondragstart = () => {
                artifactBeingDraggedOff = taxonomyArtifact;
                artifactBeingDraggedOn = undefined;
            };
        }
        element.onclick = ev => {
            artifactSelected = taxonomyArtifact;
            renderCanvas();
        };
        if (taxonomyArtifactId && incompatabilities[taxonomyArtifactId]) {
            element.className += ' error';
            element.title += ' (incompatible with ' + incompatabilities[taxonomyArtifactId].join(', ') + ')';
        }
    }
    return element;
}

function getPropertyValueFromDefinition(artifactId: string, propertyName: string) {
    if (tokenDefinition) {
        for (const searchIn of [
            tokenDefinition.behaviorsList, 
            tokenDefinition.behaviorGroupsList.map(_ => _.behaviorArtifactsList).reduce((a, b) => a.concat(b), []), 
            tokenDefinition.propertySetsList, 
        ]) {
            for (const candidate of searchIn) {
                if (candidate?.reference?.id === artifactId) {
                    for (const property of candidate.propertiesList) {
                        if (property.name === propertyName) {
                            return property.templateValue;
                        }
                    }
                }
            }
        }
    }
    return '';
}

function handleMessage(message: any) {
    if (message.taxonomy) {
        console.log('Received taxonomy update', message.taxonomy);
        taxonomy = message.taxonomy;
    }
    let shouldRenderCanvas = false;
    if (message.formula) {
        console.log('Received TokenFormula update', message.formula);
        tokenFormula = message.formula;
        tokenDefinition = undefined;
        shouldRenderCanvas = true;
    }
    if (message.definition) {
        console.log('Received TokenDefinition update', message.definition);
        tokenDefinition = message.definition;
        tokenFormula = undefined;
        shouldRenderCanvas = true;
    }
    if (message.incompatabilities) {
        console.log('Received incompatabilities update', message.incompatabilities);
        incompatabilities = message.incompatabilities;
        shouldRenderCanvas = true;
    }
    renderTaxonomy();
    if (shouldRenderCanvas) {
        renderCanvas();
    }
}

function initializePanel() {
    dom = new Dom();
    vsCodePostMessage = acquireVsCodeApi().postMessage;
    window.addEventListener('message', msg => handleMessage(msg.data));
    vsCodePostMessage({ e: tokenDesignerEvents.Init });
    dom.canvas.ondragover = ev => {
        ev.preventDefault();
        if (artifactBeingDraggedOn) {
            dom.canvas.className = 'dragHover';
        }
    };
    dom.canvas.ondragleave = () => {
        dom.canvas.className = '';
    };
    dom.canvas.ondrop = ev => {
        ev.preventDefault();
        dom.canvas.className = '';
        if (draggingInspector) {
            const canvasOffset = dom.canvas.getBoundingClientRect();
            dom.inspector.style.left = Math.round(ev.x - canvasOffset.x - draggingInspector.offsetX) + 'px';
            dom.inspector.style.top = Math.round(ev.y - canvasOffset.y - draggingInspector.offsetY) + 'px';
            dom.inspector.style.right = 'auto';
        }
        draggingInspector = undefined;
        addToTokenDesign();
    };
    dom.canvas.onclick = ev => {
        if (ev.target === dom.canvas) {
            artifactSelected = undefined;
            renderCanvas();
        }
    };    
    dom.inspector.ondragstart = ev => {
        draggingInspector = ev;
    };
    dom.nameInput.onblur = ev => {
        vsCodePostMessage({ e: tokenDesignerEvents.SetDefinitionName, name: dom.nameInput.value });
    };
    dom.descriptionInput.onblur = ev => {
        vsCodePostMessage({ e: tokenDesignerEvents.SetFormulaDescription, description: dom.descriptionInput.value });
    };
}

function removeFromTokenDesign() {
    if (tokenFormula && artifactBeingDraggedOff) {
        vsCodePostMessage({ e: tokenDesignerEvents.Remove, id: artifactBeingDraggedOff.artifact?.artifactSymbol?.id });
        artifactBeingDraggedOff = undefined;
    }
}

function renderCanvas() {
    htmlHelpers.clearChildren(dom.canvasTokenBase);
    htmlHelpers.clearChildren(dom.behaviorsArea);
    if (tokenFormula) {
        if (tokenFormula.tokenBase?.base?.id) {
            dom.canvasTokenBase.appendChild(createToolElement(tokenFormula.tokenBase?.base?.id, false, true));
        } else {
            dom.canvasTokenBase.appendChild(createInvalidToolElement());
        }
        for (const propertySet of tokenFormula.propertySetsList) {
            dom.canvasTokenBase.appendChild(createToolElement(propertySet.propertySet?.id, false, true));
        }
        for (const behaviorGroup of tokenFormula.behaviorGroupsList) {
            dom.behaviorsArea.appendChild(createToolElement(behaviorGroup.behaviorGroup?.id, false, true));
        }
        for (const behavior of tokenFormula.behaviorsList) {
            dom.behaviorsArea.appendChild(createToolElement(behavior.behavior?.id, false, true));
        }
        dom.formula.innerHTML = tokenFormula.artifact?.artifactSymbol?.visual || '';
        dom.formula.title = tokenFormula.artifact?.artifactSymbol?.tooling || '';
        dom.descriptionInput.value = tokenFormula.artifact?.artifactDefinition?.businessDescription || '';
        dom.descriptionInput.style.display = 'block';
        dom.nameInput.style.display = 'none';
    }
    if (tokenDefinition) {
        if (tokenDefinition.tokenBase?.reference?.id) {
            dom.canvasTokenBase.appendChild(createToolElement(tokenDefinition.tokenBase?.reference?.id, false, false));
        } else {
            dom.canvasTokenBase.appendChild(createInvalidToolElement());
        }
        for (const propertySet of tokenDefinition.propertySetsList) {
            dom.canvasTokenBase.appendChild(createToolElement(propertySet.reference?.id, false, false));
        }
        for (const behaviorGroup of tokenDefinition.behaviorGroupsList) {
            dom.behaviorsArea.appendChild(createToolElement(behaviorGroup.reference?.id, false, false));
        }
        for (const behavior of tokenDefinition.behaviorsList) {
            dom.behaviorsArea.appendChild(createToolElement(behavior.reference?.id, false, false));
        }
        dom.formula.innerHTML = tokenDefinition.artifact?.artifactSymbol?.visual || '';
        dom.formula.title = tokenDefinition.artifact?.artifactSymbol?.tooling || '';
        dom.nameInput.value = tokenDefinition.artifact?.name || '';
        dom.nameInput.style.display = 'block';
        dom.descriptionInput.style.display = 'none';
    }
    renderInspector();   
}

function renderInspector() {
    dom.inspector.style.display = artifactSelected ? 'block' : 'none';
    if (artifactSelected) {
        dom.inspectorTitle.innerText = artifactSelected.artifact?.name || 'Inspector';
        dom.inspectorDescription.innerText = artifactSelected.artifact?.artifactDefinition?.businessDescription || '';
        htmlHelpers.clearChildren(dom.inspectorPropertiesTable);
        htmlHelpers.clearChildren(dom.inspectorPropertiesList);
        dom.inspectorPropertiesTable.style.display = tokenDefinition ? 'table' : 'none';
        dom.inspectorPropertiesList.style.display = tokenDefinition ? 'none' : 'block';
        renderInspectorProperties(artifactSelected, artifactSelected.artifact?.artifactSymbol?.id || '');
    }
}

function renderInspectorProperties(artifactOrReference: any, prefix: string) {
    const propertyList = artifactOrReference.propertiesList as ttfCore.Property.AsObject[] | undefined;
    dom.propertiesHeading.style.display = 'none';
    for (const property of propertyList || []) {
        dom.propertiesHeading.style.display = 'block';
        if (tokenDefinition) {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            th.innerText = property.name;
            row.appendChild(th);
            const td = document.createElement('td');
            const input = document.createElement('input');
            const id = artifactOrReference.reference?.id || artifactOrReference.artifact?.artifactSymbol?.id;
            input.value = getPropertyValueFromDefinition(id, property.name);
            input.onchange = () => {
                vsCodePostMessage({ 
                    e: tokenDesignerEvents.SetDefinitionProperty, 
                    artifactId: id,
                    propertyName: property.name,
                    value: input.value,
                });
            };
            input.onblur = () => {
                dom.inspectorHelp.innerText = '';
            };
            input.onfocus = () => {
                dom.inspectorHelp.innerText = property.valueDescription;
            };
            td.appendChild(input);
            row.appendChild(td);
            dom.inspectorPropertiesTable.appendChild(row);
        } else if (tokenFormula) {
            const listItem = document.createElement('li');
            listItem.innerText = property.name;
            if (property.templateValue) {
                listItem.innerText += ' = ' + property.templateValue;
            }
            if (property.valueDescription) {
                const subList = document.createElement('ul');
                const subListItem = document.createElement('li');
                subListItem.innerText = property.valueDescription;
                subList.appendChild(subListItem);
                listItem.appendChild(subList);
            }
            dom.inspectorPropertiesList.appendChild(listItem);
        }
    }
    const behaviorsList = (artifactOrReference).behaviorsList as ttfCore.BehaviorReference.AsObject[] | undefined;
    for (const behavior of behaviorsList || []) {
        renderInspectorProperties(behavior,  prefix + '/' + (behavior.reference?.id || ''));
    }
}

function renderTaxonomy() {
    if (taxonomy) {
        renderToolbox('tokenBasesToolbox', taxonomy.baseTokenTypes);
        renderToolbox('propertySetsToolbox', taxonomy.propertySets);
        renderToolbox('behaviorsToolbox', taxonomy.behaviors);
        renderToolbox('behaviorGroupsToolbox', taxonomy.behaviorGroups);
    }
}

function renderToolbox(
    elementId: string, 
    artifacts: toolboxArtifact[]) {

    const toolboxElement = document.getElementById(elementId);
    if (toolboxElement) {
        htmlHelpers.clearChildren(toolboxElement);
        const dragEnabled = !!tokenFormula;
        for (const artifact of artifacts) {
            const toolElement = createToolElement(artifact.artifact?.artifactSymbol?.id, true, dragEnabled);
            toolboxElement.appendChild(toolElement);
        }
        toolboxElement.ondragover = ev => {
            ev.preventDefault();
            if (artifactBeingDraggedOff) {
                toolboxElement.className = 'toolbox dragHover';
            }
        };
        toolboxElement.ondragleave = ev => {
            toolboxElement.className = 'toolbox';
        };
        toolboxElement.ondrop = ev => {
            ev.preventDefault();
            toolboxElement.className = 'toolbox';
            removeFromTokenDesign();
        };
    }
}

window.onload = initializePanel;