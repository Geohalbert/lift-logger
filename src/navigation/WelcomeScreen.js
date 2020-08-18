import React from "react";
import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/colors";
import CustomAction from "../components/CustomAction";
export default class WelcomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
        <View
          style={{
            flex: 1,
            borderColor: "black",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Ionicons name="ios-fitness" size={150} color={colors.logoColor} />
          <Text style={{ fontSize: 50, fontWeight: "100", color: "white" }}>
            Lift Logger
          </Text>
        </View>
        <View
          style={{
            flex: 1,

            alignItems: "center"
          }}
        >
          <CustomAction
            style={{
              width: 200,
              backgroundColor: "transparent",
              borderWidth: 0.5,
              borderColor: colors.bgPrimary,
              marginBottom: 10
            }}
            title="Login"
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Text style={{ fontWeight: "100", color: "white" }}>Login</Text>
          </CustomAction>
        </View>
      </View>
    );
  }
}
