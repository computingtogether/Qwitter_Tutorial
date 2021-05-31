import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAve5eMVjZ4YAWID8LhLDxPwm1dVOxY5EA",
    authDomain: "qwitter-b6398.firebaseapp.com",
    projectId: "qwitter-b6398",
    storageBucket: "qwitter-b6398.appspot.com",
    messagingSenderId: "1078300885025",
    appId: "1:1078300885025:web:172ca2266202133f582360"
}

firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()

export default db
