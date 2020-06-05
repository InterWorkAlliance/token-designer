import React from "react";

import { Artifact } from "../../ttf/artifact_pb";
import { TemplateDefinition, Property, Invocation } from "../../ttf/core_pb";

import ArtifactReference from "./ArtifactReference";

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

function Properties({ tree }: { tree: PropertyTree }) {
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
              {!!_.invocations.length && (
                <>
                  <div style={paddingTop}>
                    <u>Invocations:</u>
                  </div>
                  <ul style={paddingTop}>
                    {_.invocations.map((i) => (
                      <li><b>{i.name}</b><br /><em>{i.description}</em></li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          {_.children && (
            <>
              <div style={paddingTop}>
                <u>Child properties:</u>
              </div>
              <Properties tree={_.children} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

type Props = {
  definition: TemplateDefinition.AsObject;
  getArtifactById: (
    id: string,
    tooling?: string
  ) => Artifact.AsObject | undefined;
};

export default function PropertyInspector({
  definition,
  getArtifactById,
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
        <>
          <div>
            <b>
              <ArtifactReference
                getArtifactById={getArtifactById}
                id={tree.referenceId}
              />{" "}
              properties:
            </b>
          </div>
          <Properties tree={tree} />
        </>
      ))}
    </>
  );
}
