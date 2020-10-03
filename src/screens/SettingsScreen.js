import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AsyncStorage, View, Text, StyleSheet } from "react-native";

import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const signOut = async () => {
    try {
      await AsyncStorage.clear();
      await dispatch({ type: "SIGN_OUT" });
      firebase.auth().signOut();
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
        title="Sign Out"
        onPress={signOut}
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
