import React from "react";

import { Provider } from "react-redux";
import { firebaseConfig } from "./src/config/Firebase";

import store from "./src/redux/store";

import LiftLogger from "./LiftLogger";

import firebase from "firebase/app";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default function App() {
  return (
    <Provider store={store}>
      <LiftLogger />
    </Provider>
  );
}
