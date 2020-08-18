import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";
import { connect } from "react-redux";
class SettingScreen extends Component {
  signOut = async () => {
    try {
      await firebase.auth().signOut();
      this.props.signOut();
    } catch (error) {
      alert("Unable to sign out right now");
    }
  };

  render() {
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
          onPress={this.signOut}
        >
          <Text style={{ fontWeight: "100", color: "white" }}>Logout</Text>
        </CustomAction>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch({ type: "SIGN_OUT" })
  };
};

export default connect(null, mapDispatchToProps)(SettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgMain
  }
});
