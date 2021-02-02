import React, { useState } from "react";
import * as uuid from "uuid";

import { Invocation } from "../../../ttf/core_pb";

import Dialog from "./Dialog";

const ensureConforming = (currentData: any, addBlankRows: boolean) => {
  currentData.id = currentData.id || uuid.v4();
  currentData.name = currentData.name || "";
  currentData.description = currentData.description || "";

  currentData.request = currentData.request || {};
  currentData.request.controlMessageName =
    currentData.request.controlMessageName || "";
  currentData.request.description = currentData.request.description || "";
  currentData.request.inputParametersList =
    currentData.request.inputParametersList || [];

  for (let i = 0; i < currentData.request.inputParametersList.length; i++) {
    currentData.request.inputParametersList[i].name =
      currentData.request.inputParametersList[i].name || "";
    currentData.request.inputParametersList[i].valueDescription =
      currentData.request.inputParametersList[i].valueDescription || "";
  }
  currentData.request.inputParametersList = currentData.request.inputParametersList.filter(
    (_: any) => !!_.name || !!_.valueDescription
  );
  if (addBlankRows) {
    currentData.request.inputParametersList.push({
      name: "",
      valueDescription: "",
    });
  }

  currentData.response = currentData.response || {};
  currentData.response.controlMessageName =
    currentData.response.controlMessageName || "";
  currentData.response.description = currentData.response.description || "";
  currentData.response.outputParametersList =
    currentData.response.outputParametersList || [];

  for (let i = 0; i < currentData.response.outputParametersList.length; i++) {
    currentData.response.outputParametersList[i].name =
      currentData.response.outputParametersList[i].name || "";
    currentData.response.outputParametersList[i].valueDescription =
      currentData.response.outputParametersList[i].valueDescription || "";
  }
  currentData.response.outputParametersList = currentData.response.outputParametersList.filter(
    (_: any) => !!_.name || !!_.valueDescription
  );
  if (addBlankRows) {
    currentData.response.outputParametersList.push({
      name: "",
      valueDescription: "",
    });
  }

  return currentData;
};

type Props = {
  initialValues?: Invocation.AsObject;
  hide: () => void;
  onSave: (invocation: Invocation.AsObject) => void;
};

export default function InvocationEditor({
  initialValues,
  hide,
  onSave,
}: Props) {
  const [currentJson, setCurrentJson] = useState<string>(
    initialValues ? JSON.stringify(initialValues) : "{}"
  );
  const formData: any = ensureConforming(JSON.parse(currentJson), true);
  const updateState = (fn: (previousData: any) => void) => {
    fn(formData);
    setCurrentJson(JSON.stringify(ensureConforming(formData, false)));
    console.log(currentJson);
  };
  const onSubmit = () => {
    onSave(ensureConforming(formData, false) as Invocation.AsObject);
  };
  return (
    <Dialog hide={hide} onSubmit={onSubmit}>
      {/* TODO: Allow editing of not_for_repetition/for_repetition_only fields */}
      <input
        type="text"
        value={formData.name || ""}
        placeholder="Invocation name"
        onChange={(e) => updateState((_) => (_.name = e.target.value))}
        style={{
          width: "100%",
          fontSize: "1.2em",
          fontWeight: "bold",
        }}
      />
      <textarea
        value={formData.description || ""}
        placeholder="Invocation description"
        onChange={(e) => updateState((_) => (_.description = e.target.value))}
        rows={4}
        style={{
          width: "100%",
          fontSize: "1.1em",
        }}
      />
      <input
        type="text"
        value={formData.id || ""}
        placeholder="Invocation ID"
        onChange={(e) => updateState((_) => (_.id = e.target.value))}
        style={{
          width: "100%",
          fontSize: "0.9em",
          fontStyle: "italic",
        }}
      />
      <table cellPadding={5} cellSpacing={5} style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th style={{ width: "50%" }}>
              <input
                type="text"
                value={formData.request?.controlMessageName || ""}
                placeholder="Request control message name"
                onChange={(e) =>
                  updateState(
                    (_) =>
                      (_.request = {
                        ...(_.request || {}),
                        controlMessageName: e.target.value,
                      })
                  )
                }
                style={{
                  width: "100%",
                  fontWeight: "bold",
                }}
              />
              <textarea
                value={formData.request?.description || ""}
                placeholder="Invocation request description"
                onChange={(e) =>
                  updateState(
                    (_) =>
                      (_.request = {
                        ...(_.request || {}),
                        description: e.target.value,
                      })
                  )
                }
                rows={4}
                style={{ width: "100%" }}
              />
            </th>
            <th style={{ width: "50%" }}>
              <input
                type="text"
                value={formData.response?.controlMessageName || ""}
                placeholder="Response control message name"
                onChange={(e) =>
                  updateState(
                    (_) =>
                      (_.response = {
                        ...(_.response || {}),
                        controlMessageName: e.target.value,
                      })
                  )
                }
                style={{
                  width: "100%",
                  fontWeight: "bold",
                }}
              />
              <textarea
                value={formData.response?.description || ""}
                placeholder="Invocation response description"
                onChange={(e) =>
                  updateState(
                    (_) =>
                      (_.response = {
                        ...(_.response || {}),
                        description: e.target.value,
                      })
                  )
                }
                rows={4}
                style={{ width: "100%" }}
              />
            </th>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
              valign="top"
            >
              {formData.request?.inputParametersList?.map(
                (_: any, i: number) => (
                  <div key={i}>
                    <input
                      type="text"
                      value={_.name || ""}
                      placeholder="Parameter name"
                      onChange={(e) =>
                        updateState(
                          (_) =>
                            (_.request.inputParametersList[i].name =
                              e.target.value)
                        )
                      }
                      style={{
                        width: "100%",
                        fontWeight: "bold",
                      }}
                    />
                    <textarea
                      value={
                        formData.request.inputParametersList[i]
                          .valueDescription || ""
                      }
                      placeholder="Parameter description"
                      onChange={(e) =>
                        updateState(
                          (_) =>
                            (_.request.inputParametersList[i].valueDescription =
                              e.target.value)
                        )
                      }
                      rows={3}
                      style={{ width: "100%" }}
                    />
                  </div>
                )
              )}
            </td>
            <td
              style={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
              valign="top"
            >
              {formData.response?.outputParametersList?.map(
                (_: any, i: number) => (
                  <div key={i}>
                    <input
                      type="text"
                      value={_.name || ""}
                      placeholder="Parameter name"
                      onChange={(e) =>
                        updateState(
                          (_) =>
                            (_.response.outputParametersList[i].name =
                              e.target.value)
                        )
                      }
                      style={{
                        width: "100%",
                        fontWeight: "bold",
                      }}
                    />
                    <textarea
                      value={
                        formData.response.outputParametersList[i]
                          .valueDescription || ""
                      }
                      placeholder="Parameter description"
                      onChange={(e) =>
                        updateState(
                          (_) =>
                            (_.response.outputParametersList[
                              i
                            ].valueDescription = e.target.value)
                        )
                      }
                      rows={3}
                      style={{ width: "100%" }}
                    />
                  </div>
                )
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </Dialog>
  );
}
