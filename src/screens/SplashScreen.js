import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/colors";

const SplashScreen = () => (
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
    </View>
  </View>
);
export default SplashScreen;
