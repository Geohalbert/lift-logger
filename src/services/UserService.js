import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export const signIn = (email, password) => {
  try {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        alert("A user with that email does not exist. Try signing Up");
        break;
      case "auth/invalid-password":
        alert("Please enter at least six characters");
        break;
      case "auth/invalid-email":
        alert("Please enter an email address");
    }
  }
};

export const signUp = (email, password) => {
  try {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        alert("A user with that email does not exist. Try signing Up");
        break;
      case "auth/invalid-password":
        alert("Please enter at least six characters");
        break;
      case "auth/email-already-in-use":
        alert("User already exists, try logging in");
        break;
      case "auth/invalid-email":
        alert("Please enter an email address");
        break;
      default:
        alert("Please enter a valid email and password");
    }
  }
};
