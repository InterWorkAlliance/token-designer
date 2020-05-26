import {
  IBaseAsObject,
  IBehaviorAsObject,
  IBehaviorGroupAsObject,
  IPropertySetAsObject,
} from "../ttfInterface";

export interface TokenDesignerTaxonomy {
  baseTokenTypes: IBaseAsObject[];
  propertySets: IPropertySetAsObject[];
  behaviors: IBehaviorAsObject[];
  behaviorGroups: IBehaviorGroupAsObject[];
}
