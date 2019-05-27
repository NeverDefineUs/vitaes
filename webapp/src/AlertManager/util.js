import { toast } from 'react-toastify';
import firebase from 'firebase';

import { getActiveLanguage } from 'i18n/locale';

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
          const language = getActiveLanguage();
          let msgStr = '';
          if (msg[language]) {
            msgStr = msg[language];
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
