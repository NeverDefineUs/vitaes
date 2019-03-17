import { toast } from 'react-toastify';
import firebase from 'firebase';

import { getBrowserLanguage } from 'i18n/locale';

let messages = [];
let messageCallback = () => { };

export function setAlertCallback(callback) {
  messageCallback = callback;
  setTimeout(() => callback(messages), 200);
}

export function setupAlerts() {
  const dbErrors = firebase.database().ref('messages');
  dbErrors.on('value', (snapshot) => {
    if (snapshot.val() !== null) {
      messages = snapshot.val();
      messageCallback(messages);
      for (const msgKey in snapshot.val()) {
        const msg = snapshot.val()[msgKey];
        if (msg !== undefined) {
          const alo = getBrowserLanguage();
          let msgStr = '';
          if (msg[alo]) {
            msgStr = msg[alo];
          } else {
            msgStr = msg.en;
          }
          let msgType = 'warning';
          if (msg.type) {
            msgType = msg.type;
          }
          toast(msgStr, { type: msgType });
        }
      }
    }
  });
}

export default setupAlerts;
