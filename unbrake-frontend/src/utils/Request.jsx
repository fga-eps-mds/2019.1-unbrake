import { API_URL_GRAPHQL } from "./Constants";

const invalidId = -1;

export default async function Request(url, method) {
  const responser = await fetch(url, {
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
      if (isNaN(values[newField.front])) {
        return `${prevMessage}${newField.back}:"${values[newField.front]}"`;
      }
      return `${prevMessage}${newField.back}:${values[newField.front]}`;
    }
    if (isNaN(values[newField.front])) {
      return `${prevMessage},${newField.back}:"${values[newField.front]}"`;
    }
    return `${prevMessage},${newField.back}:${values[newField.front]}`;
  }, initialUrl);

  url += `){${informations.response}{${informations.variablesResponse}}}}`;

  const response = await Request(url, "POST");

  if (response.errors !== undefined) return invalidId;

  return response.data[informations.mutation][informations.response][
    informations.variablesResponse
  ];
};
