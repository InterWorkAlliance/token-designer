import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfCore from "./ttf/core_pb";
import * as ttfTaxonomy from "./ttf/taxonomy_pb";

export interface ITtfInterface {
  createArtifact(
    request: ttfArtifact.NewArtifactRequest,
    callback: (
      error: ITtfError | null,
      response: ttfArtifact.NewArtifactResponse
    ) => void
  ): any;

  createTemplateDefinition(
    request: ttfArtifact.NewTemplateDefinition,
    callback: (
      error: ITtfError | null,
      response: ttfCore.TemplateDefinition
    ) => void
  ): any;

  deleteArtifact(
    request: ttfArtifact.DeleteArtifactRequest,
    callback: (error: ITtfError | null, response: any) => void
  ): any;

  getFullTaxonomy(
    request: ttfTaxonomy.TaxonomyVersion,
    callback: (error: ITtfError | null, response: ttfTaxonomy.Taxonomy) => void
  ): any;

  getTemplateDefinitionArtifact(
    request: ttfArtifact.ArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: ttfCore.TemplateDefinition
    ) => void
  ): any;

  getTemplateFormulaArtifact(
    request: ttfArtifact.ArtifactSymbol,
    callback: (
      error: ITtfError | null,
      response: ttfCore.TemplateFormula
    ) => void
  ): any;

  getBehaviorArtifact(
    request: ttfArtifact.ArtifactSymbol,
    callback: (error: ITtfError | null, response: ttfCore.Behavior) => void
  ): any;

  getBehaviorGroupArtifact(
    request: ttfArtifact.ArtifactSymbol,
    callback: (error: ITtfError | null, response: ttfCore.BehaviorGroup) => void
  ): any;

  updateArtifact(
    request: ttfArtifact.UpdateArtifactRequest,
    callback: (error: ITtfError | null, response: any) => void
  ): any;
}

export interface ITtfError {}
