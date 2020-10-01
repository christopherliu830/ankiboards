export default function(name, token) {
  console.log(name, token);
  const options = {
    headers: { 
      'Authorization' : `Bearer ${token}`, 
      'Content-Type' : 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({username: name}),
  }
  return fetch(process.env.REACT_APP_API + '/private/name-change', options);
}