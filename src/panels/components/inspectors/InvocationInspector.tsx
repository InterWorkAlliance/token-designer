import React from "react";

import { Invocation } from "../../../ttf/core_pb";

type Props = {
  invocation: Invocation.AsObject;
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
