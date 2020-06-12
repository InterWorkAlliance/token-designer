import React, { Fragment } from "react";

import { TemplateDefinition, Property, Invocation } from "../../../ttf/core_pb";

import ArtifactReference from "../ArtifactReference";

import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type PropertyTree = {
  path: string;
  properties: {
    name: string;
    templateValue: string;
    valueDescription: string;
    invocations: Invocation.AsObject[];
    children?: PropertyTree;
  }[];
};

const extractProperties = (
  path: string,
  properties: Property.AsObject[]
): PropertyTree => ({
  path,
  properties: properties.map((_) => ({
    name: _.name,
    templateValue: _.templateValue,
    valueDescription: _.valueDescription,
    invocations: _.propertyInvocationsList,
    children: _.propertiesList.length
      ? extractProperties(`${path}/${_.name}`, _.propertiesList)
      : undefined,
  })),
});

function AllPropertiesInspector({ tree }: { tree: PropertyTree }) {
  const paddingTop: React.CSSProperties = { paddingTop: "var(--padding)" };
  return (
    <ul>
      {tree.properties.map((_) => (
        <li style={paddingTop} key={_.name}>
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
                {!_.templateValue && !!_.children && (
                  <>
                    = <em>[ ]</em>
                  </>
                )}
              </div>
              <div>
                <em>{_.valueDescription}</em>
              </div>
            </>
          )}
          {_.children && (
            <>
              <div style={paddingTop}>
                <u>Child properties:</u>
              </div>
              <AllPropertiesInspector tree={_.children} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

type Props = {
  taxonomy: TaxonomyAsObjects;
  definition: TemplateDefinition.AsObject;
};

export default function PropertyInspector({ taxonomy, definition }: Props) {
  const properties = [
    ...definition.behaviorGroupsList.map((_) => _.behaviorArtifactsList).flat(),
    ...definition.behaviorsList,
    ...definition.propertySetsList,
  ]
    .map((_) => ({
      referenceId: _.reference?.id,
      ...extractProperties(_.reference?.id || "", _.propertiesList),
    }))
    .filter((_) => _.properties.length); // exclude empty paths
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
