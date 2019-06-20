import Cookies from "universal-cookie";
import { API_URL_GRAPHQL } from "./Constants";

const cookies = new Cookies();

const invalidId = -1;

export default async function Request(url, method) {
  const token = cookies.get("token");
  const responser = await fetch(url, {
    headers: { Authorization: `JWT ${token}` },
    method
  }).then(response => {
    return response.json();
  });

  return responser;
}

export const createMutationUrl = async (
  informations,
  variableNames,
  values
) => {
  const initialUrl = `${API_URL_GRAPHQL}?query=mutation{${
    informations.mutation
  }(`;

  let url = variableNames.reduce((prevMessage, newField) => {
    if (prevMessage.length === initialUrl.length) {
      if (Number.isNaN(Number(values[newField.front]))) {
        return `${prevMessage}${newField.back}:"${values[newField.front]}"`;
      }
      return `${prevMessage}${newField.back}:${values[newField.front]}`;
    }
    if (Number.isNaN(Number(values[newField.front]))) {
      return `${prevMessage},${newField.back}:"${values[newField.front]}"`;
    }
    return `${prevMessage},${newField.back}:${values[newField.front]}`;
  }, initialUrl);

  url += `){${informations.response}{${informations.variablesResponse}}}}`;

  const response = await Request(url, "POST");

  if (response.errors !== undefined)
    return { invalidId, error: response.error };

  return response.data[informations.mutation][informations.response][
    informations.variablesResponse
  ];
};
