// To parse this data:
//
//   import { Convert, TemplateFormula } from "./file";
//
//   const templateFormula = Convert.toTemplateFormula(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * Represents the Template Formula that is used in combination to validate a
 * TemplateDefinition.
 */
export interface TemplateFormula {
    artifact?:        TemplateFormulaArtifact;
    behavior_groups?: BehaviorGroupElement[];
    behaviors?:       BehaviorElement[];
    /**
     * If hybrid, this can contain the list of child token classes.
     */
    child_tokens?:  TemplateFormula[];
    property_sets?: PropertySetElement[];
    /**
     * Template Type
     */
    template_type?: number | string;
    token_base?:    TokenBase;
}

/**
 * Contains artifact metadata structure
 */
export interface TemplateFormulaArtifact {
    /**
     * List other names this artifact is know by in other industry contexts.
     */
    aliases?: string[];
    /**
     * Descriptive meta data about the artifact
     */
    artifact_definition?: ArtifactArtifactDefinition;
    /**
     * Includes proto, markdown or other files located in the artifact version folder.
     */
    artifact_files?: ArtifactFile[];
    /**
     * Contains the unique identifier for the artifact.
     */
    artifact_symbol?: ArtifactSymbol;
    /**
     * List of contributors to the artifact.
     */
    contributors?: Contributor[];
    /**
     * Optional source code uri used for codegen tools
     */
    control_uri?: string;
    /**
     * Typically used for a BehaviorGroups or Behaviors that have a dependency on other
     * artifacts.
     */
    dependencies?: Dependency[];
    /**
     * For behaviors that have opposites, or if the base token, behavior or property-sets with
     * conflicts.
     */
    incompatible_with_symbols?: TaxonomyModelArtifactArtifactSymbol[];
    /**
     * List know influences for behaviors that are primarly influence behaviors. Like Roles or
     * Delegable.
     */
    influenced_by_symbols?: InfluencedBySymbol[];
    /**
     * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
     * bytes to produce a complete artifact object model instance.
     */
    maps?: ArtifactMaps;
    /**
     * This is the display and folder name for the artifact
     */
    name?: string;
}

/**
 * Navigation to parent
 *
 * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
 * bytes to produce a complete artifact object model instance.
 *
 * Maps are references for an artifact.
 */
export interface ResourceMaps {
    /**
     * Navigation to parent
     */
    artifact?: MapsArtifact;
    /**
     * References to code.
     */
    code_references?: TaxonomyModelArtifactMapReference[];
    /**
     * References to implementations or solutions.
     */
    implementation_references?: TaxonomyModelArtifactMapReference[];
    /**
     * Reference to external frameworks, legal guidance, etc.
     */
    resources?: Resource[];
}

/**
 * A reference to external an resource.
 */
export interface Resource {
    /**
     * Description of the reference, can be helpful if there are many references.
     */
    description?: string;
    /**
     * Type of mapping
     */
    mapping_type?: number | string;
    /**
     * Navigation to parent
     */
    maps?: ResourceMaps;
    /**
     * Name of the reference.
     */
    name?: string;
    /**
     * Path, URL, DiD, etc.
     */
    resource_path?: string;
}

/**
 * Navigation to parent
 *
 * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
 * bytes to produce a complete artifact object model instance.
 *
 * Maps are references for an artifact.
 */
export interface CodeReferenceMaps {
    /**
     * Navigation to parent
     */
    artifact?: MapsArtifact;
    /**
     * References to code.
     */
    code_references?: TaxonomyModelArtifactMapReference[];
    /**
     * References to implementations or solutions.
     */
    implementation_references?: TaxonomyModelArtifactMapReference[];
    /**
     * Reference to external frameworks, legal guidance, etc.
     */
    resources?: Resource[];
}

/**
 * Data for a Mapping
 */
export interface TaxonomyModelArtifactMapReference {
    /**
     * Mapping Type
     */
    mapping_type?: number | string;
    /**
     * Navigation to parent
     */
    maps?: CodeReferenceMaps;
    /**
     * Name of the mapping, can include a description.
     */
    name?: string;
    /**
     * Targeted Platform
     */
    platform?: number | string;
    /**
     * Path, URL, DiD, etc.
     */
    reference_path?: string;
}

/**
 * Navigation to parent
 *
 * Contains artifact metadata structure
 */
export interface MapsArtifact {
    /**
     * List other names this artifact is know by in other industry contexts.
     */
    aliases?: string[];
    /**
     * Descriptive meta data about the artifact
     */
    artifact_definition?: ArtifactArtifactDefinition;
    /**
     * Includes proto, markdown or other files located in the artifact version folder.
     */
    artifact_files?: ArtifactFile[];
    /**
     * Contains the unique identifier for the artifact.
     */
    artifact_symbol?: ArtifactSymbol;
    /**
     * List of contributors to the artifact.
     */
    contributors?: Contributor[];
    /**
     * Optional source code uri used for codegen tools
     */
    control_uri?: string;
    /**
     * Typically used for a BehaviorGroups or Behaviors that have a dependency on other
     * artifacts.
     */
    dependencies?: Dependency[];
    /**
     * For behaviors that have opposites, or if the base token, behavior or property-sets with
     * conflicts.
     */
    incompatible_with_symbols?: TaxonomyModelArtifactArtifactSymbol[];
    /**
     * List know influences for behaviors that are primarly influence behaviors. Like Roles or
     * Delegable.
     */
    influenced_by_symbols?: InfluencedBySymbol[];
    /**
     * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
     * bytes to produce a complete artifact object model instance.
     */
    maps?: ArtifactMaps;
    /**
     * This is the display and folder name for the artifact
     */
    name?: string;
}

/**
 * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
 * bytes to produce a complete artifact object model instance.
 *
 * Maps are references for an artifact.
 */
export interface ArtifactMaps {
    /**
     * Navigation to parent
     */
    artifact?: MapsArtifact;
    /**
     * References to code.
     */
    code_references?: TaxonomyModelArtifactMapReference[];
    /**
     * References to implementations or solutions.
     */
    implementation_references?: TaxonomyModelArtifactMapReference[];
    /**
     * Reference to external frameworks, legal guidance, etc.
     */
    resources?: Resource[];
}

/**
 * Navigation to parent
 *
 * Contains artifact metadata structure
 */
export interface ArtifactFileArtifact {
    /**
     * List other names this artifact is know by in other industry contexts.
     */
    aliases?: string[];
    /**
     * Descriptive meta data about the artifact
     */
    artifact_definition?: ArtifactArtifactDefinition;
    /**
     * Includes proto, markdown or other files located in the artifact version folder.
     */
    artifact_files?: ArtifactFile[];
    /**
     * Contains the unique identifier for the artifact.
     */
    artifact_symbol?: ArtifactSymbol;
    /**
     * List of contributors to the artifact.
     */
    contributors?: Contributor[];
    /**
     * Optional source code uri used for codegen tools
     */
    control_uri?: string;
    /**
     * Typically used for a BehaviorGroups or Behaviors that have a dependency on other
     * artifacts.
     */
    dependencies?: Dependency[];
    /**
     * For behaviors that have opposites, or if the base token, behavior or property-sets with
     * conflicts.
     */
    incompatible_with_symbols?: TaxonomyModelArtifactArtifactSymbol[];
    /**
     * List know influences for behaviors that are primarly influence behaviors. Like Roles or
     * Delegable.
     */
    influenced_by_symbols?: InfluencedBySymbol[];
    /**
     * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
     * bytes to produce a complete artifact object model instance.
     */
    maps?: ArtifactMaps;
    /**
     * This is the display and folder name for the artifact
     */
    name?: string;
}

/**
 * Artifact Files are files other than the serialized json that can include protos,
 * markdown, etc.
 */
export interface ArtifactFile {
    /**
     * Navigation to parent
     */
    artifact?: ArtifactFileArtifact;
    /**
     * Type of content in the file.
     */
    content?: number | string;
    /**
     * An optional byte array of the file contents.
     */
    file_data?: string;
    /**
     * File name
     */
    file_name?: string;
}

/**
 * Navigation to parent
 *
 * Contains artifact metadata structure
 */
export interface ArtifactDefinitionArtifact {
    /**
     * List other names this artifact is know by in other industry contexts.
     */
    aliases?: string[];
    /**
     * Descriptive meta data about the artifact
     */
    artifact_definition?: ArtifactArtifactDefinition;
    /**
     * Includes proto, markdown or other files located in the artifact version folder.
     */
    artifact_files?: ArtifactFile[];
    /**
     * Contains the unique identifier for the artifact.
     */
    artifact_symbol?: ArtifactSymbol;
    /**
     * List of contributors to the artifact.
     */
    contributors?: Contributor[];
    /**
     * Optional source code uri used for codegen tools
     */
    control_uri?: string;
    /**
     * Typically used for a BehaviorGroups or Behaviors that have a dependency on other
     * artifacts.
     */
    dependencies?: Dependency[];
    /**
     * For behaviors that have opposites, or if the base token, behavior or property-sets with
     * conflicts.
     */
    incompatible_with_symbols?: TaxonomyModelArtifactArtifactSymbol[];
    /**
     * List know influences for behaviors that are primarly influence behaviors. Like Roles or
     * Delegable.
     */
    influenced_by_symbols?: InfluencedBySymbol[];
    /**
     * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
     * bytes to produce a complete artifact object model instance.
     */
    maps?: ArtifactMaps;
    /**
     * This is the display and folder name for the artifact
     */
    name?: string;
}

/**
 * Navigation to parent
 *
 * Descriptive meta data about the artifact
 *
 * The definition should contain non-technical descriptions of the artifact.
 */
export interface AnalogyArtifactDefinition {
    /**
     * Provide analogies to add to the understanding of the artifact.
     */
    analogies?: Analogy[];
    /**
     * Navigation to parent
     */
    artifact?: ArtifactDefinitionArtifact;
    /**
     * A description of the business use case.
     */
    business_description?: string;
    /**
     * Provide an existing real world example.
     */
    business_example?: string;
    /**
     * Should contain contextual information, debates or nuanced information.
     */
    comments?: string;
}

/**
 * An analogy outside of blockchains and tokens of this artifact.
 */
export interface Analogy {
    /**
     * Navigation to parent
     */
    artifact_definition?: AnalogyArtifactDefinition;
    /**
     * Descrive scenarios, etc.
     */
    description?: string;
    /**
     * Analogy name
     */
    name?: string;
}

/**
 * Descriptive meta data about the artifact
 *
 * The definition should contain non-technical descriptions of the artifact.
 */
export interface ArtifactArtifactDefinition {
    /**
     * Provide analogies to add to the understanding of the artifact.
     */
    analogies?: Analogy[];
    /**
     * Navigation to parent
     */
    artifact?: ArtifactDefinitionArtifact;
    /**
     * A description of the business use case.
     */
    business_description?: string;
    /**
     * Provide an existing real world example.
     */
    business_example?: string;
    /**
     * Should contain contextual information, debates or nuanced information.
     */
    comments?: string;
}

/**
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface ArtifactSymbol {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

/**
 * Artifact Contributor.
 */
export interface Contributor {
    /**
     * Person's name
     */
    name?: string;
    /**
     * Member organization
     */
    organization?: string;
}

/**
 * An artifact may have a dependency, if listed it will be validated and included in
 * compositions.
 */
export interface Dependency {
    /**
     * Describe how the symbol influences this artifact, like non-divisible or delegable.
     */
    description?: string;
    /**
     * Symbol of the dependency.
     */
    symbol?: DependencySymbol;
}

/**
 * Symbol of the dependency.
 *
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface DependencySymbol {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

/**
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface TaxonomyModelArtifactArtifactSymbol {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

/**
 * Reference to influencing artifact
 */
export interface InfluencedBySymbol {
    /**
     * List of behaviors or property-sets that are influenced by this symbol.
     */
    applies_to?: TaxonomyModelArtifactArtifactSymbol[];
    /**
     * Describe how the symbol influences this artifact, like non-divisible or delegable.
     */
    description?: string;
    /**
     * The ArtifactSymbol of the influencer.
     */
    symbol?: InfluencedBySymbolSymbol;
}

/**
 * The ArtifactSymbol of the influencer.
 *
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface InfluencedBySymbolSymbol {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

/**
 * Used to wrap the BehaviorGroup type for a formula, currently on holds a reference to the
 * symbol of the type being used.
 */
export interface BehaviorGroupElement {
    /**
     * Referenced BehaviorGroup.
     */
    behavior_group?: BehaviorGroupBehaviorGroup;
}

/**
 * Referenced BehaviorGroup.
 *
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface BehaviorGroupBehaviorGroup {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

/**
 * Used to wrap the Behavior type for a formula, currently on holds a reference to the
 * symbol of the type being used.
 */
export interface BehaviorElement {
    /**
     * Referenced behavior.
     */
    behavior?: BehaviorBehavior;
}

/**
 * Referenced behavior.
 *
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface BehaviorBehavior {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

/**
 * Used to wrap the PropertySet for a formula, currently on holds a reference to the symbol
 * of the type being used.
 */
export interface PropertySetElement {
    /**
     * Referenced PropertySet
     */
    property_set?: PropertySetPropertySet;
}

/**
 * Referenced PropertySet
 *
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface PropertySetPropertySet {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

export interface TokenBase {
    /**
     * Usually from the template parent
     */
    base?: Base;
}

/**
 * Usually from the template parent
 *
 * Contains the unique identifier for the artifact.
 *
 * Applied to each artifact
 */
export interface Base {
    /**
     * Unique identifier GUID/UUID - should be generated when the artifact is created. Must be
     * unique throughout the framework.
     */
    id?: string;
    /**
     * For templates only
     */
    template_validated?: boolean;
    /**
     * Symbol for single artifact and formula for templates
     */
    tooling?: string;
    /**
     * Artifact Type
     */
    type?: number | string;
    /**
     * For visualization, not guaranteed to be accurate.
     */
    version?: string;
    /**
     * Symbol for single artifact and formula for templates
     */
    visual?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTemplateFormula(json: string): TemplateFormula {
        return cast(JSON.parse(json), r("TemplateFormula"));
    }

    public static templateFormulaToJson(value: TemplateFormula): string {
        return JSON.stringify(uncast(value, r("TemplateFormula")), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "TemplateFormula": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("TemplateFormulaArtifact")) },
        { json: "behavior_groups", js: "behavior_groups", typ: u(undefined, a(r("BehaviorGroupElement"))) },
        { json: "behaviors", js: "behaviors", typ: u(undefined, a(r("BehaviorElement"))) },
        { json: "child_tokens", js: "child_tokens", typ: u(undefined, a(r("TemplateFormula"))) },
        { json: "property_sets", js: "property_sets", typ: u(undefined, a(r("PropertySetElement"))) },
        { json: "template_type", js: "template_type", typ: u(undefined, u(0, "")) },
        { json: "token_base", js: "token_base", typ: u(undefined, r("TokenBase")) },
    ], "any"),
    "TemplateFormulaArtifact": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "artifact_definition", js: "artifact_definition", typ: u(undefined, r("ArtifactArtifactDefinition")) },
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("ArtifactFile"))) },
        { json: "artifact_symbol", js: "artifact_symbol", typ: u(undefined, r("ArtifactSymbol")) },
        { json: "contributors", js: "contributors", typ: u(undefined, a(r("Contributor"))) },
        { json: "control_uri", js: "control_uri", typ: u(undefined, "") },
        { json: "dependencies", js: "dependencies", typ: u(undefined, a(r("Dependency"))) },
        { json: "incompatible_with_symbols", js: "incompatible_with_symbols", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactSymbol"))) },
        { json: "influenced_by_symbols", js: "influenced_by_symbols", typ: u(undefined, a(r("InfluencedBySymbol"))) },
        { json: "maps", js: "maps", typ: u(undefined, r("ArtifactMaps")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], "any"),
    "ResourceMaps": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("MapsArtifact")) },
        { json: "code_references", js: "code_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "implementation_references", js: "implementation_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "resources", js: "resources", typ: u(undefined, a(r("Resource"))) },
    ], "any"),
    "Resource": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "mapping_type", js: "mapping_type", typ: u(undefined, u(0, "")) },
        { json: "maps", js: "maps", typ: u(undefined, r("ResourceMaps")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "resource_path", js: "resource_path", typ: u(undefined, "") },
    ], "any"),
    "CodeReferenceMaps": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("MapsArtifact")) },
        { json: "code_references", js: "code_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "implementation_references", js: "implementation_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "resources", js: "resources", typ: u(undefined, a(r("Resource"))) },
    ], "any"),
    "TaxonomyModelArtifactMapReference": o([
        { json: "mapping_type", js: "mapping_type", typ: u(undefined, u(0, "")) },
        { json: "maps", js: "maps", typ: u(undefined, r("CodeReferenceMaps")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "platform", js: "platform", typ: u(undefined, u(0, "")) },
        { json: "reference_path", js: "reference_path", typ: u(undefined, "") },
    ], "any"),
    "MapsArtifact": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "artifact_definition", js: "artifact_definition", typ: u(undefined, r("ArtifactArtifactDefinition")) },
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("ArtifactFile"))) },
        { json: "artifact_symbol", js: "artifact_symbol", typ: u(undefined, r("ArtifactSymbol")) },
        { json: "contributors", js: "contributors", typ: u(undefined, a(r("Contributor"))) },
        { json: "control_uri", js: "control_uri", typ: u(undefined, "") },
        { json: "dependencies", js: "dependencies", typ: u(undefined, a(r("Dependency"))) },
        { json: "incompatible_with_symbols", js: "incompatible_with_symbols", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactSymbol"))) },
        { json: "influenced_by_symbols", js: "influenced_by_symbols", typ: u(undefined, a(r("InfluencedBySymbol"))) },
        { json: "maps", js: "maps", typ: u(undefined, r("ArtifactMaps")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], "any"),
    "ArtifactMaps": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("MapsArtifact")) },
        { json: "code_references", js: "code_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "implementation_references", js: "implementation_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "resources", js: "resources", typ: u(undefined, a(r("Resource"))) },
    ], "any"),
    "ArtifactFileArtifact": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "artifact_definition", js: "artifact_definition", typ: u(undefined, r("ArtifactArtifactDefinition")) },
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("ArtifactFile"))) },
        { json: "artifact_symbol", js: "artifact_symbol", typ: u(undefined, r("ArtifactSymbol")) },
        { json: "contributors", js: "contributors", typ: u(undefined, a(r("Contributor"))) },
        { json: "control_uri", js: "control_uri", typ: u(undefined, "") },
        { json: "dependencies", js: "dependencies", typ: u(undefined, a(r("Dependency"))) },
        { json: "incompatible_with_symbols", js: "incompatible_with_symbols", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactSymbol"))) },
        { json: "influenced_by_symbols", js: "influenced_by_symbols", typ: u(undefined, a(r("InfluencedBySymbol"))) },
        { json: "maps", js: "maps", typ: u(undefined, r("ArtifactMaps")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], "any"),
    "ArtifactFile": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("ArtifactFileArtifact")) },
        { json: "content", js: "content", typ: u(undefined, u(0, "")) },
        { json: "file_data", js: "file_data", typ: u(undefined, "") },
        { json: "file_name", js: "file_name", typ: u(undefined, "") },
    ], "any"),
    "ArtifactDefinitionArtifact": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "artifact_definition", js: "artifact_definition", typ: u(undefined, r("ArtifactArtifactDefinition")) },
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("ArtifactFile"))) },
        { json: "artifact_symbol", js: "artifact_symbol", typ: u(undefined, r("ArtifactSymbol")) },
        { json: "contributors", js: "contributors", typ: u(undefined, a(r("Contributor"))) },
        { json: "control_uri", js: "control_uri", typ: u(undefined, "") },
        { json: "dependencies", js: "dependencies", typ: u(undefined, a(r("Dependency"))) },
        { json: "incompatible_with_symbols", js: "incompatible_with_symbols", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactSymbol"))) },
        { json: "influenced_by_symbols", js: "influenced_by_symbols", typ: u(undefined, a(r("InfluencedBySymbol"))) },
        { json: "maps", js: "maps", typ: u(undefined, r("ArtifactMaps")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], "any"),
    "AnalogyArtifactDefinition": o([
        { json: "analogies", js: "analogies", typ: u(undefined, a(r("Analogy"))) },
        { json: "artifact", js: "artifact", typ: u(undefined, r("ArtifactDefinitionArtifact")) },
        { json: "business_description", js: "business_description", typ: u(undefined, "") },
        { json: "business_example", js: "business_example", typ: u(undefined, "") },
        { json: "comments", js: "comments", typ: u(undefined, "") },
    ], "any"),
    "Analogy": o([
        { json: "artifact_definition", js: "artifact_definition", typ: u(undefined, r("AnalogyArtifactDefinition")) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], "any"),
    "ArtifactArtifactDefinition": o([
        { json: "analogies", js: "analogies", typ: u(undefined, a(r("Analogy"))) },
        { json: "artifact", js: "artifact", typ: u(undefined, r("ArtifactDefinitionArtifact")) },
        { json: "business_description", js: "business_description", typ: u(undefined, "") },
        { json: "business_example", js: "business_example", typ: u(undefined, "") },
        { json: "comments", js: "comments", typ: u(undefined, "") },
    ], "any"),
    "ArtifactSymbol": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
    "Contributor": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "organization", js: "organization", typ: u(undefined, "") },
    ], "any"),
    "Dependency": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "symbol", js: "symbol", typ: u(undefined, r("DependencySymbol")) },
    ], "any"),
    "DependencySymbol": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
    "TaxonomyModelArtifactArtifactSymbol": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
    "InfluencedBySymbol": o([
        { json: "applies_to", js: "applies_to", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactSymbol"))) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "symbol", js: "symbol", typ: u(undefined, r("InfluencedBySymbolSymbol")) },
    ], "any"),
    "InfluencedBySymbolSymbol": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
    "BehaviorGroupElement": o([
        { json: "behavior_group", js: "behavior_group", typ: u(undefined, r("BehaviorGroupBehaviorGroup")) },
    ], "any"),
    "BehaviorGroupBehaviorGroup": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
    "BehaviorElement": o([
        { json: "behavior", js: "behavior", typ: u(undefined, r("BehaviorBehavior")) },
    ], "any"),
    "BehaviorBehavior": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
    "PropertySetElement": o([
        { json: "property_set", js: "property_set", typ: u(undefined, r("PropertySetPropertySet")) },
    ], "any"),
    "PropertySetPropertySet": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
    "TokenBase": o([
        { json: "base", js: "base", typ: u(undefined, r("Base")) },
    ], "any"),
    "Base": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "template_validated", js: "template_validated", typ: u(undefined, true) },
        { json: "tooling", js: "tooling", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "visual", js: "visual", typ: u(undefined, "") },
    ], "any"),
};
