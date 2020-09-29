import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";

export default function WelcomeScreen(props) {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name="ios-fitness" size={150} color={colors.logoColor} />
        <Text style={styles.logoText}>Lift Logger</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <CustomAction
          style={styles.customAction}
          title="Login"
          onPress={() => props.navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </CustomAction>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontWeight: "100"
  },
  container: {
    backgroundColor: colors.bgMain,
    flex: 1
  },
  customAction: {
    backgroundColor: "transparent",
    borderColor: colors.bgPrimary,
    borderWidth: 0.5,
    marginBottom: 10,
    width: 200
  },
  logo: {
    alignItems: "center",
    borderColor: "black",
    flex: 1,
    justifyContent: "center"
  },
  logoText: {
    color: "white",
    fontSize: 50,
    fontWeight: "100"
  }
});
