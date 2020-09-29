import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet } from "react-native";

import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  signOut = async () => {
    try {
      await firebase.auth().signOut();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      alert("Unable to sign out right now");
    }
  };

  return (
    <View style={styles.container}>
      <CustomAction
        style={{
          width: 200,
          backgroundColor: "transparent",
          borderWidth: 0.5,
          borderColor: colors.bgError
        }}
        title="Sign Up"
        onPress={() => this.signOut()}
      >
        <Text style={{ fontWeight: "100", color: "white" }}>Logout</Text>
      </CustomAction>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgMain
  }
});
