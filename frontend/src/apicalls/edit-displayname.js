export default async function(displayname, token) {
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username: displayname})
  }
  console.log(options);
  const response = await fetch(process.env.REACT_APP_API + '/name-change', options);
  if (!response.ok) throw Error();

  const data = await response.json();
  return data;
}