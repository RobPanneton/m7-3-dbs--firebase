import React, { createContext, useEffect, useState } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyBhvySD0EQOJmHfVADvTucFQZz58_uaHBE",
  authDomain: "user-app-2ee5f.firebaseapp.com",
  databaseURL: "https://user-app-2ee5f.firebaseio.com",
  projectId: "user-app-2ee5f",
  storageBucket: "user-app-2ee5f.appspot.com",
  messagingSenderId: "729870811919",
  appId: "1:729870811919:web:a640bfbb0f89b08f6ab47a",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export const AppContext = createContext(null);

const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState("");
  const handleSignOut = () => {
    signOut();
    setAppUser({});
    setMessage("");
  };

  useEffect(() => {
    if (user) {
      fetch(`/users`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{ appUser, signInWithGoogle, handleSignOut, message }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
  firebaseApp,
})(AppProvider);
