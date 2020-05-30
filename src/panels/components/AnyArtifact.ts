import { Base, PropertySet, BehaviorGroup, Behavior } from "../../ttf/core_pb";

type AnyArtifact =
  | Base.AsObject
  | PropertySet.AsObject
  | BehaviorGroup.AsObject
  | Behavior.AsObject;

export default AnyArtifact;
