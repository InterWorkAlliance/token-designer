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
  postMessage?: (message: any) => void;
  loadFormula?: (tooling: string) => void;
};

export default function ArtifactInspector({
  taxonomy,
  artifact,
  artifactType,
  update,
  postMessage,
  loadFormula,
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
          postMessage={!!update ? postMessage : undefined}
        />
      );
      break;
    case "behavior-group":
      specificTypeInspector = (
        <BehaviorGroupInspector
          taxonomy={taxonomy}
          artifact={artifact as BehaviorGroup.AsObject}
          postMessage={!!update ? postMessage : undefined}
        />
      );
      break;
    case "property-set":
      specificTypeInspector = (
        <PropertySetInspector
          taxonomy={taxonomy}
          artifact={artifact as PropertySet.AsObject}
          postMessage={!!update ? postMessage : undefined}
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
          loadFormula={loadFormula}
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
                          action: "editListItem",
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
        <ArtifactSymbolBox
          symbol={core.artifactSymbol}
          edit={
            update
              ? () =>
                  update({
                    action: "editString",
                    type: "symbol",
                    existing: core.artifactSymbol?.tooling,
                  })
              : undefined
          }
          loadFormula={loadFormula}
        />
      )}
      {core.artifactDefinition?.businessDescription && (
        <p>
          {core.artifactDefinition?.businessDescription}
          {!!update && (
            <EditLink
              onClick={() =>
                update({
                  action: "editString",
                  type: "businessDescription",
                  existing: core.artifactDefinition?.businessDescription,
                })
              }
            />
          )}
        </p>
      )}
      {!!update && !core.artifactDefinition?.businessDescription && (
        <p>
          <i>No business description</i>
          <AddLink
            onClick={() =>
              update({
                action: "editString",
                type: "businessDescription",
              })
            }
          />
        </p>
      )}
      {core.artifactDefinition?.businessExample && (
        <p>
          For example: <i>{core.artifactDefinition?.businessExample}</i>
          {!!update && (
            <EditLink
              onClick={() =>
                update({
                  action: "editString",
                  type: "businessExample",
                  existing: core.artifactDefinition?.businessExample,
                })
              }
            />
          )}
        </p>
      )}
      {!!update && !core.artifactDefinition?.businessExample && (
        <p>
          <i>No business example</i>
          <AddLink
            onClick={() =>
              update({
                action: "editString",
                type: "businessExample",
              })
            }
          />
        </p>
      )}
      {core.artifactDefinition?.comments && (
        <p>
          <i>Note:</i> {core.artifactDefinition?.comments}
          {!!update && (
            <EditLink
              onClick={() =>
                update({
                  action: "editString",
                  type: "comments",
                  existing: core.artifactDefinition?.comments,
                })
              }
            />
          )}
        </p>
      )}
      {!!update && !core.artifactDefinition?.comments && (
        <p>
          <i>No comments</i>
          <AddLink
            onClick={() =>
              update({
                action: "editString",
                type: "comments",
              })
            }
          />
        </p>
      )}
      {(!!update || !!core.artifactDefinition?.analogiesList?.length) && (
        <div>
          <u>Analogies:</u>{" "}
          {!!update && (
            <AddLink
              onClick={() =>
                update({
                  action: "editString",
                  type: "analogy.name",
                })
              }
            />
          )}
          <ul>
            {core.artifactDefinition?.analogiesList.map((_, i) => (
              <li key={JSON.stringify(_)}>
                {_.name}{" "}
                {!!update && (
                  <>
                    <EditLink
                      onClick={() =>
                        update({
                          action: "editString",
                          type: "analogy.name",
                          existing: _.name,
                          index: i,
                        })
                      }
                    />
                    <DeleteLink
                      onClick={() =>
                        update({
                          action: "delete",
                          type: "analogy.name",
                          index: i,
                        })
                      }
                    />
                  </>
                )}
                <ul>
                  <li>
                    {_.description}{" "}
                    {!!update && (
                      <EditLink
                        onClick={() =>
                          update({
                            action: "editString",
                            type: "analogy.description",
                            existing: _.description,
                            index: i,
                          })
                        }
                      />
                    )}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      {(!!update || !!core.contributorsList?.length) && (
        <div>
          <u>Contributors:</u>{" "}
          {!!update && (
            <AddLink
              onClick={() =>
                update({
                  action: "editString",
                  type: "contributor.name",
                })
              }
            />
          )}
          <ul>
            {core.contributorsList.map((_, i) => (
              <li key={JSON.stringify(_)}>
                {_.name}
                {!!update && (
                  <>
                    {" "}
                    <EditLink
                      onClick={() =>
                        update({
                          action: "editString",
                          type: "contributor.name",
                          existing: _.name,
                          index: i,
                        })
                      }
                    />{" "}
                  </>
                )}
                {_.name && _.organization && <>, </>}
                <i>
                  {_.organization || (!!update && "Organization not set")}
                </i>{" "}
                {!!update && (
                  <>
                    <EditLink
                      onClick={() =>
                        update({
                          action: "editString",
                          type: "contributor.organization",
                          existing: _.organization,
                          index: i,
                        })
                      }
                    />
                    <DeleteLink
                      onClick={() =>
                        update({
                          action: "delete",
                          type: "contributor.name",
                          index: i,
                        })
                      }
                    />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(!!update || !!core.dependenciesList?.length) && (
        <div>
          <u>Dependencies:</u>{" "}
          {!!update && (
            <AddLink
              onClick={() =>
                update({
                  action: "addRef",
                  type: "dependency",
                })
              }
            />
          )}
          <ul>
            {core.dependenciesList.map((_, i) => (
              <li key={JSON.stringify(_)}>
                <ArtifactReference
                  taxonomy={taxonomy}
                  id={_.symbol?.id}
                  tooling={_.symbol?.tooling}
                />
                {_.description && <> ({_.description})</>}{" "}
                {!!update && (
                  <DeleteLink
                    onClick={() =>
                      update({
                        action: "delete",
                        type: "dependency",
                        index: i,
                      })
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(!!update || !!core.influencedBySymbolsList?.length) && (
        <div>
          <u>Influenced by:</u>{" "}
          {!!update && (
            <AddLink
              onClick={() =>
                update({
                  action: "addRef",
                  type: "influencedBy",
                })
              }
            />
          )}
          <ul>
            {core.influencedBySymbolsList.map((_, i) => (
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
                )}{" "}
                {!!update && (
                  <DeleteLink
                    onClick={() =>
                      update({
                        action: "delete",
                        type: "influencedBy",
                        index: i,
                      })
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(!!update || !!core.incompatibleWithSymbolsList?.length) && (
        <div>
          <u>Incompatible with:</u>{" "}
          {!!update && (
            <AddLink
              onClick={() =>
                update({
                  action: "addRef",
                  type: "incompatibleWith",
                })
              }
            />
          )}
          <ul>
            {core.incompatibleWithSymbolsList.map((_, i) => (
              <li key={JSON.stringify(_)}>
                <ArtifactReference
                  taxonomy={taxonomy}
                  id={_.id}
                  tooling={_.tooling}
                />{" "}
                {!!update && (
                  <DeleteLink
                    onClick={() =>
                      update({
                        action: "delete",
                        type: "incompatibleWith",
                        index: i,
                      })
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {specificTypeInspector}
    </>
  );
}
