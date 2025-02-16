import firebase from 'firebase/app'
import 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAyzfG2ipA6OMWIeiNJMLGcFXamQ1x6Y40',
  authDomain: 'moveai-612b7.firebaseapp.com',
  projectId: 'moveai-612b7',
  storageBucket: 'moveai-612b7.firebasestorage.app',
  messagingSenderId: '726124940988',
  appId: '1:726124940988:web:c4c57e68195ec643e14ab9',
  measurementId: 'G-CD2YWS3ZHB',
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)

export const fDb = firebase.firestore(app)

firebase
  .firestore()
  .enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  })

// Function to Add Chat History
export async function addChatHistory(arg: {
  wallet: string
  sessionId: string
  title: string
  content: string
  role: string
}) {
  const { wallet, title, content, role, sessionId } = arg
  return await fDb
    .collection('history')
    .doc(wallet)
    .collection('chats')
    .doc(sessionId)
    .set({
      content,
      role,
      title,
      id: sessionId,
      timestamp: new Date(),
    })
}

// Function to Get Chat History Stream
export function getChatHistoryStream(wallet: string) {
  return fDb
    .collection('history')
    .doc(wallet)
    .collection('chats')
    .orderBy('timestamp', 'desc')
    .limit(50)
}

export async function getSession(wallet: string, sessionId: string) {
  return (
    await fDb
      .collection('history')
      .doc(wallet)
      .collection('chats')
      .doc(sessionId)
      .get()
  ).data()
}

// export function getChatHistoryStream(wallet: string) {
//   return fDb
//     .collection('history')
//     .doc(wallet)
//     .collection('chats')
//     .orderBy('timestamp')
//     .limit(50)
// }
