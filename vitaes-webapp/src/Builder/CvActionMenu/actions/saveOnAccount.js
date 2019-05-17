import firebase from 'firebase';

export default function saveOnAccount(user, userData, success) {
  if (user !== null) {
    const db = firebase
      .database()
      .ref('users')
      .child(user.uid);
    db.set(userData);
    success();
  }
}
