import React, { useState, useEffect, useContext, createContext } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBogzlbTQy23RqoY6z1WT7asvpn2uCwsEs",
  authDomain: "ankiboards-f7b90.firebaseapp.com",
  databaseURL: "https://ankiboards-f7b90.firebaseio.com",
  projectId: "ankiboards-f7b90",
  storageBucket: "ankiboards-f7b90.appspot.com",
  messagingSenderId: "586644990846",
  appId: "1:586644990846:web:0b9b32292b5b16cd7b212f",
  measurementId: "G-YZTENY8YK2"
};
firebase.initializeApp(firebaseConfig);

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext);
}

function useProvideAuth() {
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) setUser(user);
      else setUser(false);
    })
    return unsubscribe;
  }, []);

  const signin = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase.auth().signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = email => {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code, password) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  return {
    user,
    signin,
    signout,
    signup,
    sendPasswordResetEmail,
    confirmPasswordReset,
  }
}
