import React from "react";

import {
  Behavior,
  Base,
  BehaviorGroup,
  PropertySet,
  TemplateDefinition,
} from "../../../ttf/core_pb";

import AddLink from "../links/AddLink";
import AnyArtifact from "../AnyArtifact";
import ArtifactReference from "../ArtifactReference";
import ArtifactSymbolBox from "../ArtifactSymbolBox";
import ArtifactType from "../ArtifactType";
import ArtifactUpdate from "../../artifactUpdate";
import BehaviorGroupInspector from "./BehaviorGroupInspector";
import BehaviorInspector from "./BehaviorInspector";
import DeleteLink from "../links/DeleteLink";
import EditLink from "../links/EditLink";
import PropertySetInspector from "./PropertySetInspector";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";
import TemplateDefinitionInspector from "./TemplateDefinitionInspector";
import TokenBaseInspector from "./TokenBaseInspector";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact?: AnyArtifact;
  artifactType?: ArtifactType;
  update?: (update: ArtifactUpdate) => void;
};

export default function ArtifactInspector({
  taxonomy,
  artifact,
  artifactType,
  update,
}: Props) {
  if (!artifact || !artifact.artifact) {
    return <></>;
  }
  let specificTypeInspector = <></>;
  switch (artifactType) {
    case "behavior":
      specificTypeInspector = (
        <BehaviorInspector
          taxonomy={taxonomy}
          artifact={artifact as Behavior.AsObject}
        />
      );
      break;
    case "behavior-group":
      specificTypeInspector = (
        <BehaviorGroupInspector
          taxonomy={taxonomy}
          artifact={artifact as BehaviorGroup.AsObject}
        />
      );
      break;
    case "property-set":
      specificTypeInspector = (
        <PropertySetInspector
          taxonomy={taxonomy}
          artifact={artifact as PropertySet.AsObject}
        />
      );
      break;
    case "token-base":
      specificTypeInspector = (
        <TokenBaseInspector
          taxonomy={taxonomy}
          artifact={artifact as Base.AsObject}
        />
      );
      break;
    case "template-definition":
      specificTypeInspector = (
        <TemplateDefinitionInspector
          taxonomy={taxonomy}
          artifact={artifact as TemplateDefinition.AsObject}
        />
      );
      break;
  }
  const core = artifact.artifact;
  return (
    <>
      {(!!update || !!core.aliasesList?.length) && (
        <p>
          <b>
            Aliases:{" "}
            {core.aliasesList.map((alias, i) => (
              <>
                {alias}
                {!!update && (
                  <>
                    <EditLink
                      onClick={() =>
                        update({
                          action: "edit",
                          type: "alias",
                          existing: alias,
                        })
                      }
                    />
                    <DeleteLink
                      onClick={() =>
                        update({
                          action: "delete",
                          type: "alias",
                          existing: alias,
                        })
                      }
                    />
                  </>
                )}
                {i !== core.aliasesList.length - 1 && <>, </>}
              </>
            ))}
          </b>
          {!!update && (
            <AddLink onClick={() => update({ action: "add", type: "alias" })} />
          )}
        </p>
      )}
      {!update && !core.aliasesList?.length && <p></p>}
      {!!core.artifactSymbol && (
        <ArtifactSymbolBox symbol={core.artifactSymbol} />
      )}
      {core.artifactDefinition?.businessDescription && (
        <p>{core.artifactDefinition?.businessDescription}</p>
      )}
      {core.artifactDefinition?.businessExample && (
        <p>
          For example: <i>{core.artifactDefinition?.businessExample}</i>
        </p>
      )}
      {core.artifactDefinition?.comments && (
        <p>
          <i>Note:</i> {core.artifactDefinition?.comments}
        </p>
      )}
      {!!core.artifactDefinition?.analogiesList?.length && (
        <div>
          <u>Analogies:</u>
          <ul>
            {core.artifactDefinition?.analogiesList.map((_) => (
              <li key={JSON.stringify(_)}>
                {_.name}
                <ul>
                  <li>{_.description}</li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!core.contributorsList?.length && (
        <div>
          <u>Contributors:</u>
          <ul>
            {core.contributorsList.map((_) => (
              <li key={JSON.stringify(_)}>
                {_.name}
                {_.name && _.organization && <>, </>}
                <i>{_.organization}</i>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!core.dependenciesList?.length && (
        <div>
          <u>Dependencies:</u>
          <ul>
            {core.dependenciesList.map((_) => (
              <li key={JSON.stringify(_)}>
                <ArtifactReference
                  taxonomy={taxonomy}
                  id={_.symbol?.id}
                  tooling={_.symbol?.tooling}
                />
                {_.description && <> ({_.description})</>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!core.influencedBySymbolsList?.length && (
        <div>
          <u>Influenced by:</u>
          <ul>
            {core.influencedBySymbolsList.map((_) => (
              <li key={JSON.stringify(_)}>
                <b>
                  <ArtifactReference
                    taxonomy={taxonomy}
                    id={_.symbol?.id}
                    tooling={_.symbol?.tooling}
                  />
                </b>
                {_.description && (
                  <>
                    <br />
                    {_.description}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!core.incompatibleWithSymbolsList?.length && (
        <div>
          <u>Incompatible with:</u>
          <ul>
            {core.incompatibleWithSymbolsList.map((_) => (
              <li key={JSON.stringify(_)}>
                <ArtifactReference
                  taxonomy={taxonomy}
                  id={_.id}
                  tooling={_.tooling}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {specificTypeInspector}
    </>
  );
}
