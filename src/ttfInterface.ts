import { taxonomy } from "./ttf/protobufs";

export interface ITtfInterface {
  createArtifact(
    request: taxonomy.model.artifact.INewArtifactRequest,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.artifact.INewArtifactResponse
    ) => void
  ): any;

  createTemplateDefinition(
    request: taxonomy.model.artifact.INewTemplateDefinition,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.ITemplateDefinition
    ) => void
  ): any;

  deleteArtifact(
    request: taxonomy.model.artifact.IDeleteArtifactRequest,
    callback: (error: ITtfError | null, response: any) => void
  ): any;

  getFullTaxonomy(
    request: taxonomy.model.ITaxonomyVersion,
    callback: (error: ITtfError | null, response: taxonomy.model.ITaxonomy) => void
  ): any;

  getTemplateDefinitionArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.ITemplateDefinition
    ) => void
  ): any;

  getTemplateFormulaArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: taxonomy.model.core.ITemplateFormula
    ) => void
  ): any;

  getBehaviorArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (error: ITtfError | null, response: taxonomy.model.core.IBehavior) => void
  ): any;

  getBehaviorGroupArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (error: ITtfError | null, response: taxonomy.model.core.IBehaviorGroup) => void
  ): any;

  getPropertySetArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (error: ITtfError | null, response: taxonomy.model.core.IPropertySet) => void
  ): any;

  getBaseArtifact(
    request: taxonomy.model.artifact.IArtifactSymbol,
    callback: (error: ITtfError | null, response: taxonomy.model.core.IBase) => void
  ): any;

  updateArtifact(
    request: taxonomy.model.artifact.IUpdateArtifactRequest,
    callback: (error: ITtfError | null, response: any) => void
  ): any;
}

export interface ITtfError {}
