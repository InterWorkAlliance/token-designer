// To parse this data:
//
//   import { Convert, TokenBase } from "./file";
//
//   const tokenBase = Convert.toTokenBase(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * Token Base
 */
export interface TokenBase {
    base?:   Base;
    values?: TokenBaseValues;
}

export interface Base {
    /**
     * Artifact metadata
     */
    artifact?: BaseArtifact;
    /**
     * The constructor type defined in the token template artifact.
     */
    constructor?: BaseConstructor;
    /**
     * A template must have a constructor, the name is the proto3 message name in the
     * implemented token base definition.  The default is Constructor.
     */
    constructor_name?: string;
    /**
     * This is a deployemnt value, a number of decimal places a single token can be divided
     * into.  A typical fiat currency has a value of 2, i.e. $100.53. A value of 0 means that
     * subdivision is not supported and a whole token is the smallest unit of the token that can
     * be owned.
     */
    decimals?: number;
    /**
     * This is a deployment value that is a common, well understood name that represents the
     * Token Class.  All instances, or tokens, within this class will be referred to by their
     * class name.
     */
    name?: string;
    /**
     * This is a deployemnt value with a reference to the owner of the token class or instance
     * which can be a blockchain address, public key or other unique identifier.
     */
    owner?: string;
    /**
     * This is a deployemnt value, Base64 encoded ByteString - can represent the initial
     * quantity created or the total minted or issued for the class.
     */
    quantity?: number | string;
    /**
     * Representation Type
     */
    representation_type?: number | string;
    /**
     * Override this from the default of Intrinsic in the BaseReference for a TemplateDefinition
     * to Reference type if needed.
     */
    supply?: number | string;
    /**
     * This is a optional deployment value which is a unique symbol or identifier, not all
     * tokens will have a symbol
     */
    symbol?: string;
    /**
     * This is a deployemnt value, contains generic non-behavioral properties as a list of
     * simple `name, value` pairs that can be implemented without property invocations for each.
     */
    token_properties?: { [key: string]: string };
    /**
     * Token Type
     */
    token_type?: number | string;
    /**
     * Token Unit
     */
    token_unit?: number | string;
    /**
     * Override this from the default of Intrinsic in the BaseReference for a TemplateDefinition
     * to Reference type if needed.
     */
    value_type?: number | string;
}

/**
 * Artifact metadata
 *
 * Contains artifact metadata structure
 */
export interface BaseArtifact {
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
 * Artifact metadata
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
 * Artifact metadata
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
 * Artifact metadata
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
 * The constructor type defined in the token template artifact.
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
export interface BaseConstructor {
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

export interface TokenBaseValues {
    /**
     * The constructor type defined in the token template artifact.
     */
    constructor?: ValuesConstructor;
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
    reference?: Reference;
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
export interface ValuesConstructor {
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
    values?: ReferenceValues;
}

/**
 * Values for this reference
 */
export interface ReferenceValues {
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

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTokenBase(json: string): TokenBase {
        return cast(JSON.parse(json), r("TokenBase"));
    }

    public static tokenBaseToJson(value: TokenBase): string {
        return JSON.stringify(uncast(value, r("TokenBase")), null, 2);
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
    "TokenBase": o([
        { json: "base", js: "base", typ: u(undefined, r("Base")) },
        { json: "values", js: "values", typ: u(undefined, r("TokenBaseValues")) },
    ], "any"),
    "Base": o([
        { json: "artifact", js: "artifact", typ: u(undefined, r("BaseArtifact")) },
        { json: "constructor", js: "constructor", typ: u(undefined, r("BaseConstructor")) },
        { json: "constructor_name", js: "constructor_name", typ: u(undefined, "") },
        { json: "decimals", js: "decimals", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "owner", js: "owner", typ: u(undefined, "") },
        { json: "quantity", js: "quantity", typ: u(undefined, u(0, "")) },
        { json: "representation_type", js: "representation_type", typ: u(undefined, u(0, "")) },
        { json: "supply", js: "supply", typ: u(undefined, u(0, "")) },
        { json: "symbol", js: "symbol", typ: u(undefined, "") },
        { json: "token_properties", js: "token_properties", typ: u(undefined, m("")) },
        { json: "token_type", js: "token_type", typ: u(undefined, u(0, "")) },
        { json: "token_unit", js: "token_unit", typ: u(undefined, u(0, "")) },
        { json: "value_type", js: "value_type", typ: u(undefined, u(0, "")) },
    ], "any"),
    "BaseArtifact": o([
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
    "BaseConstructor": o([
        { json: "type_url", js: "type_url", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, "") },
    ], "any"),
    "TokenBaseValues": o([
        { json: "constructor", js: "constructor", typ: u(undefined, r("ValuesConstructor")) },
        { json: "constructor_name", js: "constructor_name", typ: u(undefined, "") },
        { json: "decimals", js: "decimals", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "owner", js: "owner", typ: u(undefined, "") },
        { json: "quantity", js: "quantity", typ: u(undefined, u(0, "")) },
        { json: "reference", js: "reference", typ: u(undefined, r("Reference")) },
        { json: "supply", js: "supply", typ: u(undefined, u(0, "")) },
        { json: "symbol", js: "symbol", typ: u(undefined, "") },
        { json: "token_properties", js: "token_properties", typ: u(undefined, m("")) },
        { json: "value_type", js: "value_type", typ: u(undefined, u(0, "")) },
    ], "any"),
    "ValuesConstructor": o([
        { json: "type_url", js: "type_url", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, "") },
    ], "any"),
    "Reference": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "reference_notes", js: "reference_notes", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, u(0, "")) },
        { json: "values", js: "values", typ: u(undefined, r("ReferenceValues")) },
    ], "any"),
    "ReferenceValues": o([
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
};
