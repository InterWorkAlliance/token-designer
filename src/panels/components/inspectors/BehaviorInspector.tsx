import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import InvocationInspector from "./InvocationInspector";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact: taxonomy.model.core.IBehavior;
};

export default function BehaviorInspector({ taxonomy, artifact }: Props) {
  return (
    <>
      {!!artifact.constructorType && (
        <div>
          <u>Constructor:</u>
          <ul>
            <li>
              <b>{artifact.constructorType}</b>
            </li>
          </ul>
        </div>
      )}
      {!!artifact?.properties?.length && (
        <div>
          <u>Properties:</u>
          <ul>
            {artifact.properties.map((_) => (
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
                {!!_.propertyInvocations?.length && (
                  <ul>
                    {_.propertyInvocations.map((_) => (
                      <li key={_.id || ""}>
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
      {!!artifact?.invocations?.length && (
        <div>
          <u>Invocations:</u>
          <ul>
            {artifact.invocations.map((_) => (
              <li key={_.id || ""}>
                <InvocationInspector invocation={_} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
