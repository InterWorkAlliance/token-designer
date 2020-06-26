import { taxonomy } from "../../ttf/protobufs";

type AnyArtifact =
  | taxonomy.model.core.IBase
  | taxonomy.model.core.IPropertySet
  | taxonomy.model.core.IBehaviorGroup
  | taxonomy.model.core.IBehavior
  | taxonomy.model.core.ITemplateDefinition;

export default AnyArtifact;
