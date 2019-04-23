export default async function Request(url, method) {
  const responser = await fetch(url, {
    method
  }).then(response => {
    return response.json();
  });

  return responser;
}
