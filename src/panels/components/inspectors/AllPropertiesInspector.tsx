import React, { Fragment } from "react";

import { taxonomy } from "../../../ttf/protobufs";

import ArtifactReference from "../ArtifactReference";

type PropertyTree = {
  path: string;
  properties?: {
    name?: string | null;
    templateValue?: string | null;
    valueDescription?: string | null;
    invocations?: taxonomy.model.core.IInvocation[] | null;
    children?: PropertyTree;
  }[];
};

const extractProperties = (
  path: string,
  properties?: taxonomy.model.core.IProperty[] | null
): PropertyTree => ({
  path,
  properties: properties?.map((_) => ({
    name: _.name,
    templateValue: _.templateValue,
    valueDescription: _.valueDescription,
    invocations: _.propertyInvocations,
    children: _.properties?.length
      ? extractProperties(`${path}/${_.name}`, _.properties)
      : undefined,
  })),
});

function AllPropertiesInspector({ tree }: { tree: PropertyTree }) {
  return (
    <ul>
      {tree.properties?.map((_) => (
        <li key={_.name || ""}>
          {_.name && (
            <>
              <div>
                <b>{_.name} </b>
                {!!_.templateValue && <>= {_.templateValue}</>}
                {!_.templateValue && !_.children && (
                  <>
                    = <em>(not set)</em>
                  </>
                )}
              </div>
            </>
          )}
          {_.children && <AllPropertiesInspector tree={_.children} />}
        </li>
      ))}
    </ul>
  );
}

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  definition: taxonomy.model.core.ITemplateDefinition;
};

export default function PropertyInspector({ taxonomy, definition }: Props) {
  const properties = [
    ...(definition.behaviorGroups?.map((_) => _.behaviorArtifacts).flat() ||
      []),
    ...(definition.behaviors || []),
    ...(definition.propertySets || []),
  ]
    .map((_) => ({
      referenceId: _?.reference?.id,
      ...extractProperties(_?.reference?.id || "", _?.properties),
    }))
    .filter((_) => _?.properties?.length); // exclude empty paths
  return (
    <>
      {properties.map((tree) => (
        <Fragment key={tree.path}>
          <div>
            <b>
              <ArtifactReference taxonomy={taxonomy} id={tree.referenceId} />{" "}
              properties:
            </b>
          </div>
          <AllPropertiesInspector tree={tree} />
        </Fragment>
      ))}
    </>
  );
}
