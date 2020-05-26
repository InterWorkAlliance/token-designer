import * as ttfArtifact from "./ttf/artifact_pb";
import * as ttfTaxonomy from "./ttf/taxonomy_pb";

export interface IArtifact {
  getArtifactDefinition(): IArtifactDefinition | undefined;
  getArtifactSymbol(): IArtifactSymbol | undefined;
  getIncompatibleWithSymbolsList(): Array<IArtifactSymbol>;
  getName(): string;
  setName(value: string): void;
}

export interface IArtifactAsObject {
  aliasesList: Array<string>;
  artifactDefinition?: IArtifactDefinitionAsObject;
  artifactSymbol?: IArtifactSymbolAsObject;
  contributorsList: Array<IContributorAsObject>;
  dependenciesList: Array<ISymbolDependencyAsObject>;
  incompatibleWithSymbolsList: Array<IArtifactSymbolAsObject>;
  influencedBySymbolsList: Array<ISymbolInfluenceAsObject>;
  name: string;
}

export interface IArtifactAnalogyAsObject {
  name: string;
  description: string;
}

export interface IArtifactDefinition {
  setBusinessDescription(value: string): void;
}

export interface IArtifactDefinitionAsObject {
  analogiesList: Array<IArtifactAnalogyAsObject>;
  businessDescription: string;
  businessExample: string;
  comments: string;
}

export interface IArtifactReferenceAsObject {
  id: string;
}

export interface IArtifactSymbol {
  getId(): string;
  getTooling(): string;
  getType(): ttfArtifact.ArtifactType;
  getVisual(): string;
  setTooling(value: string): void;
  setVisual(value: string): void;
}

export interface IArtifactSymbolAsObject {
  id: string;
  tooling: string;
}

export interface IBase {
  getArtifact(): IArtifact | undefined;
}

export interface IBaseAsObject {
  artifact?: IArtifactAsObject;
}

export interface IBaseReferenceAsObject {
  reference?: IArtifactReferenceAsObject;
}

export interface IBehavior {
  getArtifact(): IArtifact | undefined;
}

export interface IBehaviorAsObject {
  artifact?: IArtifactAsObject;
}

export interface IBehaviorGroup {
  getArtifact(): IArtifact | undefined;
}

export interface IBehaviorGroupAsObject {
  artifact?: IArtifactAsObject;
}

export interface IBehaviorGroupReference {
  getBehaviorArtifactsList(): Array<IBehaviorReference>;
}

export interface IBehaviorGroupReferenceAsObject {
  reference?: IArtifactReferenceAsObject;
}

export interface IBehaviorReference {}

export interface IBehaviorReferenceAsObject {
  reference?: IArtifactReferenceAsObject;
}

export interface IClientUnaryCall {}

export interface IContributorAsObject {
  name: string;
  organization: string;
}

export interface IPropertySet {
  getArtifact(): IArtifact | undefined;
}

export interface IPropertySetAsObject {
  artifact?: IArtifactAsObject;
}

export interface IPropertySetReference {}

export interface IPropertySetReferenceAsObject {
  reference?: IArtifactReferenceAsObject;
}

export interface IServiceClient {
  createArtifact(
    request: ttfArtifact.NewArtifactRequest,
    callback: (error: IServiceError | null, response: any) => void
  ): IClientUnaryCall;

  createTemplateDefinition(
    request: ttfArtifact.NewTemplateDefinition,
    callback: (
      error: IServiceError | null,
      response: ITemplateDefinition
    ) => void
  ): IClientUnaryCall;

  deleteArtifact(
    request: ttfArtifact.DeleteArtifactRequest,
    callback: (error: IServiceError | null, response: any) => void
  ): IClientUnaryCall;

  getFullTaxonomy(
    request: ttfTaxonomy.TaxonomyVersion,
    callback: (error: IServiceError | null, response: ITaxonomy) => void
  ): IClientUnaryCall;

  getTemplateDefinitionArtifact(
    request: ttfArtifact.ArtifactSymbol,
    callback: (
      error: IServiceError | null,
      response: ITemplateDefinition
    ) => void
  ): IClientUnaryCall;

  getTemplateFormulaArtifact(
    request: ttfArtifact.ArtifactSymbol,
    callback: (error: IServiceError | null, response: ITemplateFormula) => void
  ): IClientUnaryCall;

  updateArtifact(
    request: ttfArtifact.UpdateArtifactRequest,
    callback: (error: IServiceError | null, response: any) => void
  ): IClientUnaryCall;
}

export interface IServiceError {}

export interface ISymbolDependencyAsObject {
  description: string;
  symbol: IArtifactSymbolAsObject;
}

export interface ISymbolInfluenceAsObject {
  description: string;
  symbol?: IArtifactSymbolAsObject;
}

export interface ITaxonomy {
  getBaseTokenTypesMap(): Map<string, IBase>;
  getBehaviorGroupsMap(): Map<string, IBehaviorGroup>;
  getBehaviorsMap(): Map<string, IBehavior>;
  getPropertySetsMap(): Map<string, IPropertySet>;
  toObject(): ITaxonomyAsObject;
}

export interface ITaxonomyAsObject {
  baseTokenTypesMap: Array<[string, IBaseAsObject]>;
  behaviorGroupsMap: Array<[string, IBehaviorGroupAsObject]>;
  behaviorsMap: Array<[string, IBehaviorAsObject]>;
  propertySetsMap: Array<[string, IPropertySetAsObject]>;
}

export interface ITemplateBase {
  getBase(): IArtifactSymbol | undefined;
}

export interface ITemplateBaseAsObject {
  base?: IArtifactSymbolAsObject;
}

export interface ITemplateBehavior {
  getBehavior(): IArtifactSymbol | undefined;
}

export interface ITemplateBehaviorAsObject {
  behavior?: IArtifactSymbolAsObject;
}

export interface ITemplateBehaviorGroup {
  getBehaviorGroup(): IArtifactSymbol | undefined;
}

export interface ITemplateBehaviorGroupAsObject {
  behaviorGroup?: IArtifactSymbolAsObject;
}

export interface ITemplateDefinition {
  getArtifact(): IArtifact | undefined;
  getBehaviorGroupsList(): Array<IBehaviorGroupReference>;
  getBehaviorsList(): Array<IBehaviorReference>;
  getPropertySetsList(): Array<IPropertySetReference>;
  toObject(): ITemplateDefinitionAsObject;
}

export interface ITemplateDefinitionAsObject {
  artifact?: IArtifactAsObject;
  behaviorGroupsList: Array<IBehaviorGroupReferenceAsObject>;
  behaviorsList: Array<IBehaviorReferenceAsObject>;
  propertySetsList: Array<IPropertySetReferenceAsObject>;
  tokenBase?: IBaseReferenceAsObject;
}

export interface ITemplateFormula {
  getArtifact(): IArtifact | undefined;
  getBehaviorGroupsList(): Array<ITemplateBehaviorGroup>;
  getBehaviorsList(): Array<ITemplateBehavior>;
  getPropertySetsList(): Array<ITemplatePropertySet>;
  getTokenBase(): ITemplateBase | undefined;
  toObject(): ITemplateFormulaAsObject;
  setBehaviorGroupsList(value: Array<ITemplateBehaviorGroup>): void;
  setBehaviorsList(value: Array<ITemplateBehavior>): void;
  setPropertySetsList(value: Array<ITemplatePropertySet>): void;
  setTokenBase(value?: ITemplateBase): void;
}

export interface ITemplateFormulaAsObject {
  behaviorGroupsList: Array<ITemplateBehaviorGroupAsObject>;
  behaviorsList: Array<ITemplateBehaviorAsObject>;
  propertySetsList: Array<ITemplatePropertySetAsObject>;
  tokenBase?: ITemplateBaseAsObject;
}

export interface ITemplatePropertySet {
  getPropertySet(): IArtifactSymbol | undefined;
}

export interface ITemplatePropertySetAsObject {
  propertySet?: IArtifactSymbolAsObject;
}
