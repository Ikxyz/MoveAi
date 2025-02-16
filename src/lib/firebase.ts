import firebase from 'firebase/app'
import 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
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
