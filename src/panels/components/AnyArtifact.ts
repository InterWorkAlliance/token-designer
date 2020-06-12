import {
  Base,
  PropertySet,
  BehaviorGroup,
  Behavior,
  TemplateDefinition,
} from "../../ttf/core_pb";

type AnyArtifact =
  | Base.AsObject
  | PropertySet.AsObject
  | BehaviorGroup.AsObject
  | Behavior.AsObject
  | TemplateDefinition.AsObject;

export default AnyArtifact;
