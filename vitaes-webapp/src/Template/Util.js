import firebase from 'firebase'
import { getHostname } from '../Util';

export function getEmptyTemplate() {
    return {owner: firebase.auth().currentUser.uid, command: "", data: {likes: 0}, name: "", params: {}, fixed_params:{}}
}

export function setTemplateFile(template, file) {
  let form = new FormData()
  form.append('file', file)

  fetch(window.location.protocol + '//' + getHostname() + '/template/files/' + template.name + '/', {
    method: 'POST',
    body: form
  }).then(response => {
    if (!response.ok) {
      var textPromise = response.text()
      textPromise.then(text => alert("Error:" + text))
    }
  })
}