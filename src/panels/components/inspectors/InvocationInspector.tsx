import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

type Props = {
  invocation: taxonomy.model.core.IInvocation;
};

export default function InvocationInspector({ invocation }: Props) {
  return (
    <>
      <b>{invocation.name}</b>: {invocation.description}
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
                {invocation.request?.inputParameters?.map((_) => (
                  <p key={_.name || ""}>
                    <b>{_.name}</b>
                    <br />
                    <i>{_.valueDescription}</i>
                  </p>
                ))}
              </td>
              <td valign="top">
                {invocation.response?.outputParameters?.map((_) => (
                  <p key={_.name || ""}>
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
