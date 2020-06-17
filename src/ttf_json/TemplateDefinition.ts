// To parse this data:
//
//   import { Convert, TemplateDefinition } from "./file";
//
//   const templateDefinition = Convert.toTemplateDefinition(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * TemplateDefinition, the Artifact.ArtifactSymbol.Id is the primary identifier for a
 * TokenTemplate.
 */
export interface TemplateDefinition {
    artifact?:          TemplateDefinitionArtifact;
    behavior_groups?:   BehaviorGroup[];
    behaviors?:         TaxonomyModelCoreBehaviorReference[];
    child_tokens?:      TemplateDefinition[];
    formula_reference?: Reference;
    property_sets?:     PropertySet[];
    token_base?:        TokenBase;
}

/**
 * Contains artifact metadata structure
 */
export interface TemplateDefinitionArtifact {
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
    artifact_files?: TaxonomyModelArtifactArtifactFile[];
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
    artifact_files?: TaxonomyModelArtifactArtifactFile[];
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
    artifact_files?: TaxonomyModelArtifactArtifactFile[];
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
export interface TaxonomyModelArtifactArtifactFile {
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
    artifact_files?: TaxonomyModelArtifactArtifactFile[];
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
 * Used to provide overriding values set in the BehaviorGroup if needed. Since most
 * BehaviorGroups are already pre-configured in context, providing values here is usually
 * not necessary.
 */
export interface BehaviorGroup {
    /**
     * If retrieved this can be populated with the behaviors nested in the group.
     */
    behavior_artifacts?: TaxonomyModelCoreBehaviorReference[];
    reference?:          BehaviorGroupReference;
}

/**
 * Used in the TemplateDefinition to provide values for the behavior.
 */
export interface TaxonomyModelCoreBehaviorReference {
    /**
     * If this is an influence behavior, list the influenced symbols here, the details on how it
     * influences is in the influence bindings.
     */
    applies_to?: TaxonomyModelArtifactArtifactSymbol[];
    /**
     * Optionally retrieved for behaviors like Role Support that needs input when setting up the
     * roles when the token class is created.  Uses Any as the type as it will not be known by
     * the framework.
     */
    constructor?: BehaviorConstructor;
    /**
     * Proto message name empty if there is no constructor, used when unpacking the Any.
     */
    constructor_type?: string;
    /**
     * Influence invocation definitions, only defined in the influencing behavior, but applied
     * during specification generation.
     */
    influence_bindings?: InfluenceBinding[];
    /**
     * Updated invocations from the base artifact, include the invocations used in the
     * definition. If the defintion does not contain the InvocationId, it will not be included
     * in the specification.
     */
    invocations?: TaxonomyModelCoreInvocation[];
    /**
     * Indicator if this is available externally or internally only.
     */
    is_external?: boolean;
    /**
     * Behavioral properties.
     */
    properties?: TaxonomyModelCoreProperty[];
    /**
     * ArtifactReference
     */
    reference?: BehaviorReference;
}

/**
 * Optionally retrieved for behaviors like Role Support that needs input when setting up the
 * roles when the token class is created.  Uses Any as the type as it will not be known by
 * the framework.
 *
 * `Any` contains an arbitrary serialized protocol buffer message along with a
 * URL that describes the type of the serialized message.
 *
 * Protobuf library provides support to pack/unpack Any values in the form
 * of utility functions or additional generated methods of the Any type.
 *
 * Example 1: Pack and unpack a message in C++.
 *
 * Foo foo = ...;
 * Any any;
 * any.PackFrom(foo);
 * ...
 * if (any.UnpackTo(&foo)) {
 * ...
 * }
 *
 * Example 2: Pack and unpack a message in Java.
 *
 * Foo foo = ...;
 * Any any = Any.pack(foo);
 * ...
 * if (any.is(Foo.class)) {
 * foo = any.unpack(Foo.class);
 * }
 *
 * Example 3: Pack and unpack a message in Python.
 *
 * foo = Foo(...)
 * any = Any()
 * any.Pack(foo)
 * ...
 * if any.Is(Foo.DESCRIPTOR):
 * any.Unpack(foo)
 * ...
 *
 * Example 4: Pack and unpack a message in Go
 *
 * foo := &pb.Foo{...}
 * any, err := ptypes.MarshalAny(foo)
 * ...
 * foo := &pb.Foo{}
 * if err := ptypes.UnmarshalAny(any, foo); err != nil {
 * ...
 * }
 *
 * The pack methods provided by protobuf library will by default use
 * 'type.googleapis.com/full.type.name' as the type URL and the unpack
 * methods only use the fully qualified type name after the last '/'
 * in the type URL, for example "foo.bar.com/x/y.z" will yield type
 * name "y.z".
 *
 *
 * JSON
 * ====
 * The JSON representation of an `Any` value uses the regular
 * representation of the deserialized, embedded message, with an
 * additional field `@type` which contains the type URL. Example:
 *
 * package google.profile;
 * message Person {
 * string first_name = 1;
 * string last_name = 2;
 * }
 *
 * {
 * "@type": "type.googleapis.com/google.profile.Person",
 * "firstName": <string>,
 * "lastName": <string>
 * }
 *
 * If the embedded message type is well-known and has a custom JSON
 * representation, that representation will be embedded adding a field
 * `value` which holds the custom JSON in addition to the `@type`
 * field. Example (for message [google.protobuf.Duration][]):
 *
 * {
 * "@type": "type.googleapis.com/google.protobuf.Duration",
 * "value": "1.212s"
 * }
 */
export interface BehaviorConstructor {
    /**
     * A URL/resource name that uniquely identifies the type of the serialized
     * protocol buffer message. This string must contain at least
     * one "/" character. The last segment of the URL's path must represent
     * the fully qualified name of the type (as in
     * `path/google.protobuf.Duration`). The name should be in a canonical form
     * (e.g., leading "." is not accepted).
     *
     * In practice, teams usually precompile into the binary all types that they
     * expect it to use in the context of Any. However, for URLs which use the
     * scheme `http`, `https`, or no scheme, one can optionally set up a type
     * server that maps type URLs to message definitions as follows:
     *
     * * If no scheme is provided, `https` is assumed.
     * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
     * value in binary format, or produce an error.
     * * Applications are allowed to cache lookup results based on the
     * URL, or have them precompiled into a binary to avoid any
     * lookup. Therefore, binary compatibility needs to be preserved
     * on changes to types. (Use versioned type names to manage
     * breaking changes.)
     *
     * Note: this functionality is not currently available in the official
     * protobuf release, and it is not used for type URLs beginning with
     * type.googleapis.com.
     *
     * Schemes other than `http`, `https` (or the empty scheme) might be
     * used with implementation specific semantics.
     */
    type_url?: string;
    /**
     * Must be a valid serialized protocol buffer of the above specified type.
     */
    value?: string;
}

/**
 * Use these to define the influencing behavior's invocation and it's target to influence
 * within the TemplateDefinition, the TTF will use this to construct the Invocation Pipeline.
 */
export interface InfluenceBinding {
    /**
     * Override or intercept
     */
    influence_type?: number | string;
    /**
     * The artifactId being invluenced
     */
    influenced_id?: string;
    /**
     * If it is an intercept this is the invocation that occurs after being intercepted. If it
     * is an override
     */
    influenced_invocation?: InfluencedInvocationObject;
    /**
     * The invocationId in the influenced artifact to be influenced.
     */
    influenced_invocation_id?: string;
    /**
     * If it is an intercept, this is the intercepting invocation, if it is override it is the
     * modified invocation
     */
    influencing_invocation?: InfluencingInvocationObject;
}

/**
 * If it is an intercept this is the invocation that occurs after being intercepted. If it
 * is an override
 *
 * Certification Target- Descibes how to invoke a behavior or property-set.
 */
export interface InfluencedInvocationObject {
    /**
     * Include the data type for the value.
     */
    description?: string;
    /**
     * Invocations are given a UUID/GUID to correctly identify influences within a definition,
     * particularly if there is an overloaded invocation, meaning a involcation with the same
     * name but different parameters
     */
    id?: string;
    /**
     * Property name if a property-set
     */
    name?: string;
    /**
     * Certification Target
     */
    request?: Request;
    /**
     * Certification Target
     */
    response?: Response;
}

/**
 * Certification Target
 */
export interface Request {
    /**
     * Name of the message
     */
    control_message_name?: string;
    /**
     * Description of the invocation
     */
    description?: string;
    /**
     * List of parameters required.
     */
    input_parameters?: TaxonomyModelCoreInvocationParameter[];
}

/**
 * Certification Target - Used to represent input and output parameters for invocations.
 */
export interface TaxonomyModelCoreInvocationParameter {
    /**
     * Parameter Name
     */
    name?: string;
    /**
     * Describe the data type and restrictions like length or type.
     */
    value_description?: string;
}

/**
 * Certification Target
 */
export interface Response {
    /**
     * Name of the message.
     */
    control_message_name?: string;
    /**
     * Description of the output from the request.
     */
    description?: string;
    /**
     * Parameters expected in the output.
     */
    output_parameters?: TaxonomyModelCoreInvocationParameter[];
}

/**
 * If it is an intercept, this is the intercepting invocation, if it is override it is the
 * modified invocation
 *
 * If it is an intercept this is the invocation that occurs after being intercepted. If it
 * is an override
 *
 * Certification Target- Descibes how to invoke a behavior or property-set.
 */
export interface InfluencingInvocationObject {
    /**
     * Include the data type for the value.
     */
    description?: string;
    /**
     * Invocations are given a UUID/GUID to correctly identify influences within a definition,
     * particularly if there is an overloaded invocation, meaning a involcation with the same
     * name but different parameters
     */
    id?: string;
    /**
     * Property name if a property-set
     */
    name?: string;
    /**
     * Certification Target
     */
    request?: Request;
    /**
     * Certification Target
     */
    response?: Response;
}

/**
 * If it is an intercept this is the invocation that occurs after being intercepted. If it
 * is an override
 *
 * Certification Target- Descibes how to invoke a behavior or property-set.
 */
export interface TaxonomyModelCoreInvocation {
    /**
     * Include the data type for the value.
     */
    description?: string;
    /**
     * Invocations are given a UUID/GUID to correctly identify influences within a definition,
     * particularly if there is an overloaded invocation, meaning a involcation with the same
     * name but different parameters
     */
    id?: string;
    /**
     * Property name if a property-set
     */
    name?: string;
    /**
     * Certification Target
     */
    request?: Request;
    /**
     * Certification Target
     */
    response?: Response;
}

/**
 * Generic property used in the framework.
 */
export interface TaxonomyModelCoreProperty {
    /**
     * Property Name
     */
    name?: string;
    /**
     * Support for nested properties.
     */
    properties?: TaxonomyModelCoreProperty[];
    /**
     * Needed for non-behavioral properties.
     */
    property_invocations?: TaxonomyModelCoreInvocation[];
    /**
     * Value, if needed, when applied in a template context or composed.
     */
    template_value?: string;
    /**
     * Description of the value that can be contained for the property, not the actual value,
     * but string, int, bool, etc.
     */
    value_description?: string;
}

/**
 * ArtifactReference
 *
 * A reference to another artifact, either TemplateBranch to TemplateBranch, or
 * ArtifactInstance to Artifact.
 */
export interface BehaviorReference {
    /**
     * This is to another Artifact's ArtifactSymbol.Id
     */
    id?: string;
    /**
     * Notes about the reference.
     */
    reference_notes?: string;
    /**
     * ArtifactType
     */
    type?: number | string;
    /**
     * Values for this reference
     */
    values?: Values;
}

/**
 * Values for this reference
 */
export interface Values {
    /**
     * Collection of files in the artifact's folder that can be looped through the files and
     * read them in as bytes to produce a complete artifact object model instance.
     */
    artifact_files?: TaxonomyModelArtifactArtifactFile[];
    /**
     * can be a URL, DID, etc.
     */
    control_uri?: string;
    /**
     * For optional navigation.
     */
    maps?: ValuesMaps;
}

/**
 * For optional navigation.
 *
 * Can be overriden by ArtifactReferenceValues loop through the files and read them in as
 * bytes to produce a complete artifact object model instance.
 *
 * Maps are references for an artifact.
 */
export interface ValuesMaps {
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
 * ArtifactReference
 *
 * A reference to another artifact, either TemplateBranch to TemplateBranch, or
 * ArtifactInstance to Artifact.
 */
export interface BehaviorGroupReference {
    /**
     * This is to another Artifact's ArtifactSymbol.Id
     */
    id?: string;
    /**
     * Notes about the reference.
     */
    reference_notes?: string;
    /**
     * ArtifactType
     */
    type?: number | string;
    /**
     * Values for this reference
     */
    values?: Values;
}

/**
 * ArtifactReference
 *
 * A reference to another artifact, either TemplateBranch to TemplateBranch, or
 * ArtifactInstance to Artifact.
 */
export interface Reference {
    /**
     * This is to another Artifact's ArtifactSymbol.Id
     */
    id?: string;
    /**
     * Notes about the reference.
     */
    reference_notes?: string;
    /**
     * ArtifactType
     */
    type?: number | string;
    /**
     * Values for this reference
     */
    values?: Values;
}

/**
 * Providing overriding values for a PropertSet in a TemplateDefinition.
 */
export interface PropertySet {
    /**
     * Values
     */
    properties?: TaxonomyModelCoreProperty[];
    reference?:  PropertySetReference;
}

/**
 * ArtifactReference
 *
 * A reference to another artifact, either TemplateBranch to TemplateBranch, or
 * ArtifactInstance to Artifact.
 */
export interface PropertySetReference {
    /**
     * This is to another Artifact's ArtifactSymbol.Id
     */
    id?: string;
    /**
     * Notes about the reference.
     */
    reference_notes?: string;
    /**
     * ArtifactType
     */
    type?: number | string;
    /**
     * Values for this reference
     */
    values?: Values;
}

export interface TokenBase {
    /**
     * The constructor type defined in the token template artifact.
     */
    constructor?: TokenBaseConstructor;
    /**
     * A template must have a constructor, the name is the proto3 message name in the
     * implemented token base definition.  The default is Constructor.
     */
    constructor_name?: string;
    /**
     * A number of decimal places a single token can be divided into.  A typical fiat currency
     * has a value of 2, i.e. $100.53. A value of 0 means that subdivision is not supported and
     * a whole token is the smallest unit of the token that can be owned.
     */
    decimals?: number;
    /**
     * A common well understood name that represents the Token Class.  All instances, or tokens,
     * within this class will be referred to by their class name.
     */
    name?: string;
    /**
     * A reference to the owner of the token class or instance which can be a blockchain
     * address, public key or other unique identifier.
     */
    owner?: string;
    /**
     * Can represent the initial quantity created or the total minted or issued for the class.
     */
    quantity?: number | string;
    /**
     * Artifact Reference
     */
    reference?: TokenBaseReference;
    /**
     * Set this to change from the default supply type from the base.
     */
    supply?: number | string;
    /**
     * An optionally unique symbol or identifier
     */
    symbol?: string;
    /**
     * Generic non-behavioral properties as a list of simple `name, value` pairs that can be
     * implemented without property invocations for each.
     */
    token_properties?: { [key: string]: string };
    /**
     * Set this to change from the default of intrinsic if it is a reference value token.
     */
    value_type?: number | string;
}

/**
 * The constructor type defined in the token template artifact.
 *
 * Optionally retrieved for behaviors like Role Support that needs input when setting up the
 * roles when the token class is created.  Uses Any as the type as it will not be known by
 * the framework.
 *
 * `Any` contains an arbitrary serialized protocol buffer message along with a
 * URL that describes the type of the serialized message.
 *
 * Protobuf library provides support to pack/unpack Any values in the form
 * of utility functions or additional generated methods of the Any type.
 *
 * Example 1: Pack and unpack a message in C++.
 *
 * Foo foo = ...;
 * Any any;
 * any.PackFrom(foo);
 * ...
 * if (any.UnpackTo(&foo)) {
 * ...
 * }
 *
 * Example 2: Pack and unpack a message in Java.
 *
 * Foo foo = ...;
 * Any any = Any.pack(foo);
 * ...
 * if (any.is(Foo.class)) {
 * foo = any.unpack(Foo.class);
 * }
 *
 * Example 3: Pack and unpack a message in Python.
 *
 * foo = Foo(...)
 * any = Any()
 * any.Pack(foo)
 * ...
 * if any.Is(Foo.DESCRIPTOR):
 * any.Unpack(foo)
 * ...
 *
 * Example 4: Pack and unpack a message in Go
 *
 * foo := &pb.Foo{...}
 * any, err := ptypes.MarshalAny(foo)
 * ...
 * foo := &pb.Foo{}
 * if err := ptypes.UnmarshalAny(any, foo); err != nil {
 * ...
 * }
 *
 * The pack methods provided by protobuf library will by default use
 * 'type.googleapis.com/full.type.name' as the type URL and the unpack
 * methods only use the fully qualified type name after the last '/'
 * in the type URL, for example "foo.bar.com/x/y.z" will yield type
 * name "y.z".
 *
 *
 * JSON
 * ====
 * The JSON representation of an `Any` value uses the regular
 * representation of the deserialized, embedded message, with an
 * additional field `@type` which contains the type URL. Example:
 *
 * package google.profile;
 * message Person {
 * string first_name = 1;
 * string last_name = 2;
 * }
 *
 * {
 * "@type": "type.googleapis.com/google.profile.Person",
 * "firstName": <string>,
 * "lastName": <string>
 * }
 *
 * If the embedded message type is well-known and has a custom JSON
 * representation, that representation will be embedded adding a field
 * `value` which holds the custom JSON in addition to the `@type`
 * field. Example (for message [google.protobuf.Duration][]):
 *
 * {
 * "@type": "type.googleapis.com/google.protobuf.Duration",
 * "value": "1.212s"
 * }
 */
export interface TokenBaseConstructor {
    /**
     * A URL/resource name that uniquely identifies the type of the serialized
     * protocol buffer message. This string must contain at least
     * one "/" character. The last segment of the URL's path must represent
     * the fully qualified name of the type (as in
     * `path/google.protobuf.Duration`). The name should be in a canonical form
     * (e.g., leading "." is not accepted).
     *
     * In practice, teams usually precompile into the binary all types that they
     * expect it to use in the context of Any. However, for URLs which use the
     * scheme `http`, `https`, or no scheme, one can optionally set up a type
     * server that maps type URLs to message definitions as follows:
     *
     * * If no scheme is provided, `https` is assumed.
     * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
     * value in binary format, or produce an error.
     * * Applications are allowed to cache lookup results based on the
     * URL, or have them precompiled into a binary to avoid any
     * lookup. Therefore, binary compatibility needs to be preserved
     * on changes to types. (Use versioned type names to manage
     * breaking changes.)
     *
     * Note: this functionality is not currently available in the official
     * protobuf release, and it is not used for type URLs beginning with
     * type.googleapis.com.
     *
     * Schemes other than `http`, `https` (or the empty scheme) might be
     * used with implementation specific semantics.
     */
    type_url?: string;
    /**
     * Must be a valid serialized protocol buffer of the above specified type.
     */
    value?: string;
}

/**
 * Artifact Reference
 *
 * ArtifactReference
 *
 * A reference to another artifact, either TemplateBranch to TemplateBranch, or
 * ArtifactInstance to Artifact.
 */
export interface TokenBaseReference {
    /**
     * This is to another Artifact's ArtifactSymbol.Id
     */
    id?: string;
    /**
     * Notes about the reference.
     */
    reference_notes?: string;
    /**
     * ArtifactType
     */
    type?: number | string;
    /**
     * Values for this reference
     */
    values?: Values;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTemplateDefinition(json: string): TemplateDefinition {
        return cast(JSON.parse(json), r("TemplateDefinition"));
    }

    public static templateDefinitionToJson(value: TemplateDefinition): string {
        return JSON.stringify(uncast(value, r("TemplateDefinition")), null, 2);
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
    "TemplateDefinition": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("TemplateDefinitionArtifact")) },
        { json: "behavior_groups", js: "behavior_groups", typ: u(undefined, a(r("BehaviorGroup"))) },
        { json: "behaviors", js: "behaviors", typ: u(undefined, a(r("TaxonomyModelCoreBehaviorReference"))) },
        { json: "child_tokens", js: "child_tokens", typ: u(undefined, a(r("TemplateDefinition"))) },
        { json: "formula_reference", js: "formula_reference", typ: u(undefined, r("Reference")) },
        { json: "property_sets", js: "property_sets", typ: u(undefined, a(r("PropertySet"))) },
        { json: "token_base", js: "token_base", typ: u(undefined, r("TokenBase")) },
    ], "any"),
    "TemplateDefinitionArtifact": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "artifact_definition", js: "artifact_definition", typ: u(undefined, r("ArtifactArtifactDefinition")) },
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactFile"))) },
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
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactFile"))) },
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
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactFile"))) },
        { json: "artifact_symbol", js: "artifact_symbol", typ: u(undefined, r("ArtifactSymbol")) },
        { json: "contributors", js: "contributors", typ: u(undefined, a(r("Contributor"))) },
        { json: "control_uri", js: "control_uri", typ: u(undefined, "") },
        { json: "dependencies", js: "dependencies", typ: u(undefined, a(r("Dependency"))) },
        { json: "incompatible_with_symbols", js: "incompatible_with_symbols", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactSymbol"))) },
        { json: "influenced_by_symbols", js: "influenced_by_symbols", typ: u(undefined, a(r("InfluencedBySymbol"))) },
        { json: "maps", js: "maps", typ: u(undefined, r("ArtifactMaps")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], "any"),
    "TaxonomyModelArtifactArtifactFile": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("ArtifactFileArtifact")) },
        { json: "content", js: "content", typ: u(undefined, u(0, "")) },
        { json: "file_data", js: "file_data", typ: u(undefined, "") },
        { json: "file_name", js: "file_name", typ: u(undefined, "") },
    ], "any"),
    "ArtifactDefinitionArtifact": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "artifact_definition", js: "artifact_definition", typ: u(undefined, r("ArtifactArtifactDefinition")) },
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactFile"))) },
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
    "BehaviorGroup": o([
        { json: "behavior_artifacts", js: "behavior_artifacts", typ: u(undefined, a(r("TaxonomyModelCoreBehaviorReference"))) },
        { json: "reference", js: "reference", typ: u(undefined, r("BehaviorGroupReference")) },
    ], "any"),
    "TaxonomyModelCoreBehaviorReference": o([
        { json: "applies_to", js: "applies_to", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactSymbol"))) },
        { json: "constructor", js: "constructor", typ: u(undefined, r("BehaviorConstructor")) },
        { json: "constructor_type", js: "constructor_type", typ: u(undefined, "") },
        { json: "influence_bindings", js: "influence_bindings", typ: u(undefined, a(r("InfluenceBinding"))) },
        { json: "invocations", js: "invocations", typ: u(undefined, a(r("TaxonomyModelCoreInvocation"))) },
        { json: "is_external", js: "is_external", typ: u(undefined, true) },
        { json: "properties", js: "properties", typ: u(undefined, a(r("TaxonomyModelCoreProperty"))) },
        { json: "reference", js: "reference", typ: u(undefined, r("BehaviorReference")) },
    ], "any"),
    "BehaviorConstructor": o([
        { json: "type_url", js: "type_url", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, "") },
    ], "any"),
    "InfluenceBinding": o([
        { json: "influence_type", js: "influence_type", typ: u(undefined, u(0, "")) },
        { json: "influenced_id", js: "influenced_id", typ: u(undefined, "") },
        { json: "influenced_invocation", js: "influenced_invocation", typ: u(undefined, r("InfluencedInvocationObject")) },
        { json: "influenced_invocation_id", js: "influenced_invocation_id", typ: u(undefined, "") },
        { json: "influencing_invocation", js: "influencing_invocation", typ: u(undefined, r("InfluencingInvocationObject")) },
    ], "any"),
    "InfluencedInvocationObject": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "request", js: "request", typ: u(undefined, r("Request")) },
        { json: "response", js: "response", typ: u(undefined, r("Response")) },
    ], "any"),
    "Request": o([
        { json: "control_message_name", js: "control_message_name", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "input_parameters", js: "input_parameters", typ: u(undefined, a(r("TaxonomyModelCoreInvocationParameter"))) },
    ], "any"),
    "TaxonomyModelCoreInvocationParameter": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "value_description", js: "value_description", typ: u(undefined, "") },
    ], "any"),
    "Response": o([
        { json: "control_message_name", js: "control_message_name", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "output_parameters", js: "output_parameters", typ: u(undefined, a(r("TaxonomyModelCoreInvocationParameter"))) },
    ], "any"),
    "InfluencingInvocationObject": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "request", js: "request", typ: u(undefined, r("Request")) },
        { json: "response", js: "response", typ: u(undefined, r("Response")) },
    ], "any"),
    "TaxonomyModelCoreInvocation": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "request", js: "request", typ: u(undefined, r("Request")) },
        { json: "response", js: "response", typ: u(undefined, r("Response")) },
    ], "any"),
    "TaxonomyModelCoreProperty": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "properties", js: "properties", typ: u(undefined, a(r("TaxonomyModelCoreProperty"))) },
        { json: "property_invocations", js: "property_invocations", typ: u(undefined, a(r("TaxonomyModelCoreInvocation"))) },
        { json: "template_value", js: "template_value", typ: u(undefined, "") },
        { json: "value_description", js: "value_description", typ: u(undefined, "") },
    ], "any"),
    "BehaviorReference": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "reference_notes", js: "reference_notes", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "values", js: "values", typ: u(undefined, r("Values")) },
    ], "any"),
    "Values": o([
        { json: "artifact_files", js: "artifact_files", typ: u(undefined, a(r("TaxonomyModelArtifactArtifactFile"))) },
        { json: "control_uri", js: "control_uri", typ: u(undefined, "") },
        { json: "maps", js: "maps", typ: u(undefined, r("ValuesMaps")) },
    ], "any"),
    "ValuesMaps": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("MapsArtifact")) },
        { json: "code_references", js: "code_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "implementation_references", js: "implementation_references", typ: u(undefined, a(r("TaxonomyModelArtifactMapReference"))) },
        { json: "resources", js: "resources", typ: u(undefined, a(r("Resource"))) },
    ], "any"),
    "BehaviorGroupReference": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "reference_notes", js: "reference_notes", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "values", js: "values", typ: u(undefined, r("Values")) },
    ], "any"),
    "Reference": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "reference_notes", js: "reference_notes", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "values", js: "values", typ: u(undefined, r("Values")) },
    ], "any"),
    "PropertySet": o([
        { json: "properties", js: "properties", typ: u(undefined, a(r("TaxonomyModelCoreProperty"))) },
        { json: "reference", js: "reference", typ: u(undefined, r("PropertySetReference")) },
    ], "any"),
    "PropertySetReference": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "reference_notes", js: "reference_notes", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "values", js: "values", typ: u(undefined, r("Values")) },
    ], "any"),
    "TokenBase": o([
        { json: "constructor", js: "constructor", typ: u(undefined, r("TokenBaseConstructor")) },
        { json: "constructor_name", js: "constructor_name", typ: u(undefined, "") },
        { json: "decimals", js: "decimals", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "owner", js: "owner", typ: u(undefined, "") },
        { json: "quantity", js: "quantity", typ: u(undefined, u(0, "")) },
        { json: "reference", js: "reference", typ: u(undefined, r("TokenBaseReference")) },
        { json: "supply", js: "supply", typ: u(undefined, u(0, "")) },
        { json: "symbol", js: "symbol", typ: u(undefined, "") },
        { json: "token_properties", js: "token_properties", typ: u(undefined, m("")) },
        { json: "value_type", js: "value_type", typ: u(undefined, u(0, "")) },
    ], "any"),
    "TokenBaseConstructor": o([
        { json: "type_url", js: "type_url", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, "") },
    ], "any"),
    "TokenBaseReference": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "reference_notes", js: "reference_notes", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "values", js: "values", typ: u(undefined, r("Values")) },
    ], "any"),
};
