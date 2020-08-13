import React, { useState } from "react";

import { Invocation } from "../../../ttf/core_pb";

import DeleteLink from "../links/DeleteLink";
import EditLink from "../links/EditLink";
import InvocationEditor from "../editors/InvocationEditor";

type Props = {
  invocation: Invocation.AsObject;
  onSave?: (invocation: Invocation.AsObject) => void;
  onDelete?: () => void;
};

export default function InvocationInspector({
  invocation,
  onSave,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      {!!onSave && isEditing && (
        <InvocationEditor
          onSave={onSave}
          hide={() => setIsEditing(false)}
          initialValues={invocation}
        />
      )}
      <b>{invocation.name}</b>: {invocation.description}
      {!!onSave && <EditLink onClick={() => setIsEditing(true)} />}
      {!!onDelete && <DeleteLink onClick={onDelete} />}
      {!!invocation.id && (
        <>
          <br />
          <em>({invocation.id})</em>
        </>
      )}
      {!!(invocation.request || invocation.response) && (
        <table cellPadding={5} cellSpacing={5} style={{ width: "100%" }}>
          <tbody>
            <tr>
              <th style={{ width: "50%" }}>
                {invocation.request?.controlMessageName}:
              </th>
              <th style={{ width: "50%" }}>
                {invocation.response?.controlMessageName}:
              </th>
            </tr>
            <tr>
              <td>
                <i>{invocation.request?.description}</i>
              </td>
              <td>
                <i>{invocation.response?.description}</i>
              </td>
            </tr>
            <tr>
              <td valign="top">
                {invocation.request?.inputParametersList.map((_) => (
                  <p key={_.name}>
                    <b>{_.name}</b>
                    <br />
                    <i>{_.valueDescription}</i>
                  </p>
                ))}
              </td>
              <td valign="top">
                {invocation.response?.outputParametersList.map((_) => (
                  <p key={_.name}>
                    <b>{_.name}</b>
                    <br />
                    <i>{_.valueDescription}</i>
                  </p>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}
