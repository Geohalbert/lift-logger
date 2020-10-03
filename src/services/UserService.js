// import { useDispatch } from "react-redux";
// import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
// import { FILE } from "dns";

// const dispatch = useDispatch();

// const storeToken = async user => {
//   try {
//     await AsyncStorage.setItem("userData", JSON.stringify(user));
//   } catch (error) {
//     console.log("Something went wrong", error);
//   }
// };

// ASYNC IS FINE, NEED TO GET DISPATCH OUT OF THIS FILE, HAVE THE FUNCTION RETURN THE USER AS A CALLBACK
export const signIn = async (email, password) => {
  try {
    const { res } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return JSON.parse(res.user);
    // storeToken(user);
    // dispatch({ type: "SET_USER", payload: user });
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

export const register = async (email, password) => {
  try {
    const { res } = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    console.log(`res: ${res}`);
    console.log(`JSON.stringify(res): ${JSON.stringify(res)}`);
    console.log(`JSON.parse(res): ${JSON.parse(res)}`);
    console.log(`res: ${res.user}`);
    console.log(`JSON.stringify(res.user): ${JSON.stringify(res.user)}`);
    console.log(`JSON.parse(res.user): ${JSON.parse(res.user)}`);
    //   console.log(`JSON.stringify(): ${}`)
    //   console.log(`: ${}`)
    //   console.log(`: ${}`)
    return JSON.parse(res.user);
    // storeToken(user);
    // dispatch({ type: "SET_USER", payload: user });
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
