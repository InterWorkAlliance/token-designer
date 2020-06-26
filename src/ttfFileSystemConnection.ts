import { promises as fs } from "fs";
import { taxonomy } from "./ttf/protobufs";
import * as uuid from "uuid";

import { ITtfInterface, ITtfError } from "./ttfInterface";

export class TtfFileSystemConnection implements ITtfInterface {
  static async create(snapshotPath: string): Promise<ITtfInterface> {
    const serializedData = await fs.readFile(snapshotPath);
    return new TtfFileSystemConnection(
      taxonomy.model.Taxonomy.decode(serializedData)
    );
  }

  private baseSnapshot: any;

  private constructor(private readonly taxonomy: taxonomy.model.Taxonomy) {
    this.baseSnapshot = taxonomy;
  }

  createArtifact(
    request: taxonomy.model.artifact.INewArtifactRequest,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.artifact.INewArtifactResponse
    ) => void
  ) {
    try {
      let done = false;
      const type = request.type;
      const artifact = request.artifact;
      if (artifact) {
        switch (type) {
          case taxonomy.model.artifact.ArtifactType.TEMPLATE_DEFINITION:
            const definition = taxonomy.model.core.TemplateDefinition.decode(
              artifact.value as Uint8Array
            );
            const id = definition?.artifact?.artifactSymbol?.id;
            if (definition && id) {
              this.taxonomy.templateDefinitions[id] = definition;
              done = true;
              callback(
                null,
                taxonomy.model.artifact.NewArtifactResponse.create()
              );
            }
            break;
          case taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA:
            const formula = taxonomy.model.core.TemplateFormula.decode(
              artifact.value as Uint8Array
            );
            const tooling = formula?.artifact?.artifactSymbol?.tooling;
            if (formula && tooling) {
              this.taxonomy.templateFormulas[tooling] = formula;
              done = true;
              callback(
                null,
                taxonomy.model.artifact.NewArtifactResponse.create()
              );
            }
            break;
          default:
            done = true;
            callback(
              `Artifact type not supported: ${type}`,
              taxonomy.model.artifact.NewArtifactResponse.create()
            );
            break;
        }
      }
      if (!done) {
        callback(
          "Artifact could not be created",
          taxonomy.model.artifact.NewArtifactResponse.create()
        );
      }
    } finally {
      this.snapshot();
    }
  }

  createTemplateDefinition(
    request: taxonomy.model.artifact.INewTemplateDefinition,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.ITemplateDefinition
    ) => void
  ) {
    try {
      const definition = taxonomy.model.core.TemplateDefinition.create();
      const formulaId = request.templateFormulaId;
      let formula = Object.values(this.taxonomy.templateFormulas).find(
        (_) => _.artifact?.artifactSymbol?.id === formulaId
      );
      if (formula) {
        let formulaArtifact = formula.artifact;
        if (!formulaArtifact) {
          formulaArtifact = taxonomy.model.artifact.Artifact.create();
        }
        const formulaName = formulaArtifact.name || "";
        const definitionName = request.tokenName || "";

        const definitionArtifact = taxonomy.model.artifact.Artifact.create(
          formulaArtifact
        );
        definition.artifact = definitionArtifact;
        definitionArtifact.artifactFiles.map(
          (_) => (_.fileName = _.fileName?.replace(formulaName, definitionName))
        );
        definitionArtifact.name = definitionName;

        let definitionArtifactSymbol = definitionArtifact.artifactSymbol;
        if (!definitionArtifactSymbol) {
          definitionArtifactSymbol = taxonomy.model.artifact.ArtifactSymbol.create();
          definitionArtifact.artifactSymbol = definitionArtifactSymbol;
        }
        const definitionId = uuid.v1();
        definitionArtifactSymbol.id = definitionId;
        definitionArtifactSymbol.type =
          taxonomy.model.artifact.ArtifactType.TEMPLATE_DEFINITION;

        const formulaReferece = taxonomy.model.artifact.ArtifactReference.create();
        definition.formulaReference = formulaReferece;
        formulaReferece.id = formulaId || "";
        formulaReferece.type =
          taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA;
        formulaReferece.referenceNotes = formulaName;

        const baseTokenId = formula.tokenBase?.base?.id;
        if (baseTokenId) {
          const baseReference = taxonomy.model.core.BaseReference.create();
          const reference = taxonomy.model.artifact.ArtifactReference.create();
          reference.id = baseTokenId;
          reference.type = taxonomy.model.artifact.ArtifactType.BASE;
          baseReference.reference = reference;
          definition.tokenBase = baseReference;
        }

        formula.behaviors
          ?.map((_) => _.behavior?.id)
          .filter((_) => !!_)
          .map((behaviorId) => {
            const behavior = this.taxonomy.behaviors[behaviorId || ""];
            const behaviorReference = taxonomy.model.core.BehaviorReference.create();
            behaviorReference.properties = [...(behavior?.properties || [])];
            behaviorReference.invocations = [...(behavior?.invocations || [])];
            behaviorReference.isExternal = true;
            const reference = taxonomy.model.artifact.ArtifactReference.create();
            reference.id = behaviorId as string;
            reference.type = taxonomy.model.artifact.ArtifactType.BEHAVIOR;
            behaviorReference.reference = reference;
            definition.behaviors.push(behaviorReference);
          });

        formula.behaviorGroups
          ?.map((_) => _.behaviorGroup?.id)
          .filter((_) => !!_)
          .map((behaviorGroupId) => {
            const behaviorGroup = this.taxonomy.behaviorGroups[
              behaviorGroupId || ""
            ];
            const behaviorGroupReference = taxonomy.model.core.BehaviorGroupReference.create();
            behaviorGroupReference.behaviorArtifacts = [
              ...(behaviorGroup?.behaviors || []),
            ];
            const reference = taxonomy.model.artifact.ArtifactReference.create();
            reference.id = behaviorGroupId as string;
            reference.type =
              taxonomy.model.artifact.ArtifactType.BEHAVIOR_GROUP;
            behaviorGroupReference.reference = reference;
            definition.behaviorGroups.push(behaviorGroupReference);
          });

        formula.propertySets
          ?.map((_) => _.propertySet?.id)
          .filter((_) => !!_)
          .map((propertySetId) => {
            const propertySet = this.taxonomy.propertySets[propertySetId || ""];
            const propertySetReference = taxonomy.model.core.PropertySetReference.create();
            propertySetReference.properties = [
              ...(propertySet?.properties || []),
            ];
            const reference = taxonomy.model.artifact.ArtifactReference.create();
            reference.id = propertySetId as string;
            reference.type = taxonomy.model.artifact.ArtifactType.PROPERTY_SET;
            propertySetReference.reference = reference;
            definition.propertySets.push(propertySetReference);
          });

        if (
          formula.templateType === taxonomy.model.artifact.TemplateType.HYBRID
        ) {
          definition.childTokens.map((_) => {
            // TODO: Repeat above logic recursively
          });
        }

        this.taxonomy.templateDefinitions[definitionId] = definition;
        const hierarchy = this.taxonomy.tokenTemplateHierarchy;
        if (hierarchy) {
          const template = taxonomy.model.core.TokenTemplate.create();
          template.definition = definition;
          template.formula = formula;
          // TODO: Put in correct place ion hierarchy:
          (hierarchy.hybrids?.fungible?.fractional?.templates?.template || {})[
            definitionId
          ] = template;
        }
        callback(null, definition);
      } else {
        callback(`Formula ${formulaId} not found`, definition);
      }
    } finally {
      this.snapshot();
    }
  }

  deleteArtifact(
    request: taxonomy.model.artifact.IDeleteArtifactRequest,
    callback: (error: ITtfError | null, response: any) => void
  ) {
    try {
      let done = false;
      const symbol = request.artifactSymbol;
      const type = symbol?.type;
      const id = symbol?.id;
      switch (type) {
        case taxonomy.model.artifact.ArtifactType.TEMPLATE_DEFINITION:
          if (id) {
            delete this.taxonomy.templateDefinitions[id];
            done = true;
            callback(null, {});
          }
          break;
        case taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA:
          for (const key of Object.getOwnPropertyNames(
            this.taxonomy.templateFormulas
          )) {
            const formula = this.taxonomy.templateFormulas[key];
            if (!done && formula.artifact?.artifactSymbol?.id === id) {
              delete this.taxonomy.templateFormulas[key];
              done = true;
              callback(null, {});
            }
          }
          break;
        default:
          done = true;
          callback(`Artifact type not supported: ${type}`, {});
          break;
      }
      if (!done) {
        callback("Artifact could not be deleted", {});
      }
    } finally {
      this.snapshot();
    }
  }

  getFullTaxonomy(
    request: taxonomy.model.TaxonomyVersion,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.Taxonomy
    ) => void
  ) {
    callback(null, taxonomy.model.Taxonomy.create(this.taxonomy));
  }

  getTemplateDefinitionArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.ITemplateDefinition
    ) => void
  ) {
    let success = false;
    const id = request.id;
    Object.values(this.taxonomy.templateDefinitions).forEach((definition) => {
      if (!success && definition.artifact?.artifactSymbol?.id === id) {
        success = true;
        callback(
          null,
          taxonomy.model.core.TemplateDefinition.create(definition)
        );
      }
    });
    if (!success) {
      callback(
        `Definition not found: ${id}`,
        taxonomy.model.core.TemplateDefinition.create()
      );
    }
  }

  getTemplateFormulaArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.ITemplateFormula
    ) => void
  ) {
    let success = false;
    const tooling = request.tooling;
    Object.values(this.taxonomy.templateFormulas).forEach((formula) => {
      if (!success && formula.artifact?.artifactSymbol?.tooling === tooling) {
        success = true;
        callback(null, taxonomy.model.core.TemplateFormula.create(formula));
      }
    });
    if (!success) {
      callback(
        `Formula not found: ${tooling}`,
        taxonomy.model.core.TemplateFormula.create()
      );
    }
  }

  getBehaviorArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.IBehavior
    ) => void
  ) {
    callback(
      null,
      taxonomy.model.core.Behavior.create(
        this.taxonomy.behaviors[request.id || ""]
      )
    );
  }

  getBehaviorGroupArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.IBehaviorGroup
    ) => void
  ) {
    callback(
      null,
      taxonomy.model.core.BehaviorGroup.create(
        this.taxonomy.behaviorGroups[request?.id || ""]
      )
    );
  }

  getPropertySetArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.IPropertySet
    ) => void
  ) {
    callback(
      null,
      taxonomy.model.core.PropertySet.create(
        this.taxonomy.propertySets[request?.id || ""]
      )
    );
  }

  getBaseArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.IBase
    ) => void
  ) {
    callback(
      null,
      taxonomy.model.core.Base.create(
        this.taxonomy.baseTokenTypes[request.id || ""]
      )
    );
  }

  updateArtifact(
    request: taxonomy.model.artifact.IUpdateArtifactRequest,
    callback: (error: ITtfError | null, response: any) => void
  ) {
    try {
      let done = false;
      const type = request.type;
      const packed = request.artifactTypeObject;
      if (packed) {
        switch (type) {
          case taxonomy.model.artifact.ArtifactType.TEMPLATE_DEFINITION:
            const definition = taxonomy.model.core.TemplateDefinition.decode(
              packed.value as Uint8Array
            );
            const id = definition.artifact?.artifactSymbol?.id;
            if (id) {
              this.taxonomy.templateDefinitions[id] = definition;
              done = true;
            }
            break;
          case taxonomy.model.artifact.ArtifactType.TEMPLATE_FORMULA:
            const formula = taxonomy.model.core.TemplateFormula.decode(
              packed.value as Uint8Array
            );
            const tooling = formula.artifact?.artifactSymbol?.tooling;
            if (tooling) {
              this.taxonomy.templateFormulas[tooling] = formula;
              done = true;
            }
            break;
          default:
            done = true;
            callback(`Artifact type not supported: ${type}`, {});
            break;
        }
      }
      if (!done) {
        callback("Artifact could not be updated", {});
      }
    } finally {
      this.snapshot();
    }
  }

  private snapshot() {
    // TODO
  }
}
