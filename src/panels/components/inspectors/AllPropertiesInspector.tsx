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
    children: _.propertiesList.length
      ? extractProperties(`${path}/${_.name}`, _.propertiesList)
      : undefined,
  })),
});

function AllPropertiesInspectorInner({
  tree,
  setDefinitionProperty,
}: {
  tree: PropertyTree;
  setDefinitionProperty: (path: string, name: string) => void;
}) {
  return (
    <ul>
      {tree.properties.map((_) => (
        <li key={_.name}>
          {_.name && (
            <>
              <div>
                <b>{_.name} </b>
                {!!_.templateValue && <>= {_.templateValue}</>}
                {!_.templateValue && !_.children && (
                  <>
                    = <em>(not set)</em>
                  </>
                )}{" "}
                <button
                  onClick={() => setDefinitionProperty(tree.path, _.name)}
                >
                  Change{" "}
                </button>
              </div>
            </>
          )}
          {_.children && (
            <AllPropertiesInspectorInner
              tree={_.children}
              setDefinitionProperty={setDefinitionProperty}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

type Props = {
  taxonomy: TaxonomyAsObjects;
  definition: TemplateDefinition.AsObject;
  setDefinitionProperty: (path: string, name: string) => void;
};

export default function AllPropertiesInspector({
  taxonomy,
  definition,
  setDefinitionProperty,
}: Props) {
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
          <AllPropertiesInspectorInner
            tree={tree}
            setDefinitionProperty={setDefinitionProperty}
          />
        </Fragment>
      ))}
    </>
  );
}
