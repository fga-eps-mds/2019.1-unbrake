export default async function request(url, method) {
  const responser = await fetch(url, {
    method
  }).then(response => {
    return response.json();
  });

  return responser;
}
