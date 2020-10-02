
export function getHeatmap(uid) {
  return fetch(process.env.REACT_APP_API + `/user/${uid}/heatmap`)
    .then( response => {
      if (!response.ok) throw Error("Error getting heatmap");
      return response.json();
    })
    .catch(err => console.log(err))
}

export function getProfileData(uid) {
  return fetch(process.env.REACT_APP_API + `/user/${uid}`)
    .then( response => {
      if (!response.ok) throw Error("Error getting profile data");
      return response.json();
    })
    .catch(err => console.log(err))
}

export function getRevlog(uid) {
  return fetch(process.env.REACT_APP_API + `/user/${uid}/revlog`)
    .then( response => {
      if (!response.ok) throw Error("Error getting revlog");
      return response.json();
    })
    .catch(err => console.log(err))
}