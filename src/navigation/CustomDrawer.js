import React from "react";
import {
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { TouchableOpacity } from "react-native-gesture-handler";

// need signout handle
_signOutAsync = async () => {
  alert("Signed out");
  //   await AsyncStorage.clear();
  navigation.navigate("Auth");
};

export default function CustomDrawer(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        style={{
          height: 240,
          alignItems: "center",
          justifyContent: "center"
        }}
        source={require("../assets/nav-logo.png")}
      />
      <ScrollView>
        <DrawerItems {...props} />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => this._signOutAsync()}>
            <Text style={styles.label}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Text style={{ position: "absolute", bottom: 20, left: 110 }}>
        Lift Logger
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 10
  },
  label: {
    marginBottom: 30,
    marginLeft: 17,
    fontWeight: "bold"
  }
});
