import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import { login } from "../redux/actions/user";

import colors from "../assets/colors";
import CustomAction from "../components/CustomAction";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default function LoginScreen(props) {
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailInvalid, onChangeEmailError] = useState(false);
  const [isPasswordInvalid, onChangePasswordError] = useState(false);
  const [isLoginInvalid, onChangeLoginError] = useState(false);
  const [shouldDisplayMessage, onChangeDisplayMessage] = useState(true);
  const [email, setEmail] = useState("");

  onSignIn = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        if (response) {
          setIsLoading(false);
          dispatch({ type: "SET_USER", payload: response.user });
        }
      } catch (error) {
        setIsLoading(false);
        switch (error.code) {
          case "auth/user-not-found":
            alert("A user with that email does not exist. Try signing Up");
            break;
          case "auth/invalid-email":
            alert("Please enter an email address");
        }
      }
    }
  };
  onSignUp = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        if (response) {
          setIsLoading(false);
          dispatch({ type: "SET_USER", payload: response.user });
        }
      } catch (error) {
        setIsLoading(false);
        if (error.code == "auth/email-already-in-use") {
          alert("User already exists, try logging in");
        }
        console.log(error);
      }
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              elevation: 1000
            }
          ]}
        >
          <ActivityIndicator size="large" color={colors.logoColor} />
        </View>
      ) : null}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          style={styles.textInput}
          placeholder={"abc@example.com"}
          placeholderTextColor={colors.bgTextInputDark}
          keyboardType="email-address"
          onChangeText={email => setEmail(email)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="enter password"
          placeholderTextColor={colors.bgTextInputDark}
          secureTextEntry
          onChangeText={password => setPassword(password)}
        />
        <View style={{ alignItems: "center" }}>
          <CustomAction
            onPress={() => this.onSignIn()}
            style={[styles.loginButtons, { borderColor: colors.bgPrimary }]}
          >
            <Text style={{ color: "white" }}>Login</Text>
          </CustomAction>
          <CustomAction
            onPress={() => this.onSignUp()}
            style={[styles.loginButtons, { borderColor: colors.bgError }]}
          >
            <Text style={{ color: "white" }}>Sign Up</Text>
          </CustomAction>
        </View>
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    marginHorizontal: 40,
    marginBottom: 10,
    color: colors.txtWhite,
    paddingHorizontal: 10
  },
  loginButtons: {
    borderWidth: 0.5,
    backgroundColor: "transparent",
    marginTop: 10,
    width: 200
  }
});
