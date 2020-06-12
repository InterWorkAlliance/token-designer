import React from "react";

import { Behavior } from "../../ttf/core_pb";

import InvocationInspector from "./InvocationInspector";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: Behavior.AsObject;
};

export default function BehaviorInspector({ taxonomy, artifact }: Props) {
  return (
    <>
      {!!artifact.constructorType && (
        <div>
          <u>Constructor:</u>
          <ul><li><b>{artifact.constructorType}</b></li></ul>
        </div>
      )}
      {!!artifact.propertiesList.length && (
        <div>
          <u>Properties:</u>
          <ul>
            {artifact.propertiesList.map((_) => (
              <li key={JSON.stringify(_)}>
                <b>{_.name}:</b>
                {!!(_.templateValue || _.valueDescription) && (
                  <>
                    {" "}
                    {_.templateValue}
                    <br />
                    {_.valueDescription}
                    <br />
                    <br />
                  </>
                )}
                {!!_.propertyInvocationsList.length && (
                  <ul>
                    {_.propertyInvocationsList.map((_) => (
                      <li key={_.id}>
                        <InvocationInspector invocation={_} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!artifact.invocationsList.length && (
        <div>
          <u>Invocations:</u>
          <ul>
            {artifact.invocationsList.map((_) => (
              <li key={_.id}>
                <InvocationInspector invocation={_} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
