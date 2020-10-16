import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { signIn, signUp } from "../services/UserService";
import { setUser } from "../redux/actions/user";

import colors from "../assets/colors";
import CustomAction from "../components/CustomAction";
import InputField from "../components/InputField";
import "firebase/auth";
import "firebase/database";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailInvalid, onChangeEmailError] = useState(false);
  const [isPasswordInvalid, onChangePasswordError] = useState(false);
  const [isLoginInvalid, onChangeLoginError] = useState(false);
  const [shouldDisplayMessage, onChangeDisplayMessage] = useState(true);

  onUpdateEmail = text => {
    onChangeEmail(text);

    // clear email error
    if (isEmailInvalid) {
      onChangeEmailError(false);
    }
    // clear login error
    if (isLoginInvalid) {
      onChangeLoginError(false);
    }
    // clear success message
    if (shouldDisplayMessage) {
      onChangeDisplayMessage(false);
    }
  };

  onUpdatePassword = text => {
    onChangePassword(text);

    // a-z A-Z 0-9 . - _ $ * ( ) # @ ! % / ^
    const passwordIsValid = /^[\w.-_$*()#@!%/]+$/.test(text);

    onChangePasswordError(!passwordIsValid);

    // clear login error
    if (isLoginInvalid) {
      onChangeLoginError(false);
    }
    // clear success message
    if (shouldDisplayMessage) {
      onChangeDisplayMessage(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    const { user } = await signIn(email, password);
    if (user) {
      setIsLoading(false);
      dispatch(setUser(user));
    } else {
      setIsLoading(false);
    }
  };

  const register = async (email, password) => {
    setIsLoading(true);
    const { user } = await signUp(email, password);
    dispatch(setUser(user));
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={isLoading}
        size="large"
        color={colors.logoColor}
        style={styles.activityIndicator}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <InputField
          isLogin
          onChangeText={text => onUpdateEmail(text)}
          label="email"
          autoCompleteType="email"
          error={isEmailInvalid}
          keyboardType="email-address"
          errorMessage={"Please enter a valid email address."}
          value={email}
          placeholder={"abc@example.com"}
          placeholderTextColor={colors.bgTextInputDark}
        />
        <InputField
          isLogin
          onChangeText={text => onUpdatePassword(text)}
          label="password"
          secureTextEntry
          error={isPasswordInvalid}
          errorMessage={"Please enter a valid password."}
          value={password}
          placeholder="enter password"
          placeholderTextColor={colors.bgTextInputDark}
        />
        <View style={{ alignItems: "center" }}>
          <CustomAction
            onPress={() => login(email, password)}
            style={[styles.loginButtons, { borderColor: colors.bgPrimary }]}
          >
            <Text style={{ color: "white" }}>Login</Text>
          </CustomAction>
          <CustomAction
            onPress={() => register(email, password)}
            style={[styles.loginButtons, { borderColor: colors.bgError }]}
          >
            <Text style={{ color: "white" }}>Register</Text>
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
  },
  activityIndicator: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1000
  }
});
