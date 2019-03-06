import firebase from 'firebase'

export function getEmptyTemplate() {
    return {owner: firebase.auth().currentUser.uid, command: "", data: {likes: 0}, name: "", params: {}, fixed_params:{}}
}
