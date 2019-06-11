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
    // console.log(informations.response, newField.front, values.command,values)

    if (prevMessage.length === initialUrl.length)
      return `${prevMessage}${newField.back}:${values[newField.front]}`;
    return `${prevMessage},${newField.back}:${values[newField.front]}`;
  }, initialUrl);

  url += `){${informations.response}{${informations.variablesResponse}}}}`;

  const response = await Request(url, "POST");

  // console.log(`Response ${informations.response}`, response)

  if (response.errors !== undefined) return invalidId;

  return response.data[informations.mutation][informations.response][
    informations.variablesResponse
  ];
};
