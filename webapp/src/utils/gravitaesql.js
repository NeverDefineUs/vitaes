import firebase from 'firebase'
import fetch from 'fetch-retry';

import { getGravitaesqlHostname } from 'utils/getHostname';

async function gravitaesql(query) {
  await firebase.auth().getRedirectResult()
  const user = firebase.auth().currentUser
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  if (user) {
    headers = {
      ...headers, 
      'Authorization': 'Bearer ' + await user.getIdToken(true),
    }
  }

  return await fetch(`${window.location.protocol}//${getGravitaesqlHostname()}/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
    })
  }).then(res => res.json()).then(res => res.data)
}

export default gravitaesql
