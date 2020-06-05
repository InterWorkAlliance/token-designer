import * as ttfCore from "../ttf/core_pb";

export interface TaxonomyAsObjects {
  baseTokenTypes: ttfCore.Base.AsObject[];
  propertySets: ttfCore.PropertySet.AsObject[];
  behaviors: ttfCore.Behavior.AsObject[];
  behaviorGroups: ttfCore.BehaviorGroup.AsObject[];
}
