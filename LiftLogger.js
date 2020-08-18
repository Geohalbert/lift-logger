import React, { Component } from "react";
import { StyleSheet } from "react-native";
import * as firebase from "firebase/app";
import "firebase/auth";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "./src/assets/colors";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { AppDrawerNavigator } from "./src/navigation/AppNavigator";

import WelcomeScreen from "./src/navigation/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SplashScreen from "./src/screens/SplashScreen";

const Stack = createStackNavigator();

class LiftLogger extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    let unsubscribe;
    try {
      unsubscribe = firebase.auth().onAuthStateChanged(user => {
        user ? this.props.signIn(user) : this.props.signOut();
        unsubscribe();
      });
    } catch (e) {
      this.props.signOut();
    }
  };

  render() {
    if (this.props.auth.isLoading) {
      return <SplashScreen />;
    }
    return (
      <NavigationContainer>
        {!this.props.auth.isSignedIn ? (
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.bgMain
              },
              headerTintColor: "white"
            }}
          >
            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerBackTitleVisible: false }}
            />
          </Stack.Navigator>
        ) : (
          <ActionSheetProvider>
            <AppDrawerNavigator />
          </ActionSheetProvider>
        )}
      </NavigationContainer>
    );
  }
}

getHeaderTitle = route => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : "Home";

  switch (routeName) {
    case "Home":
      return "Workouts";
    case "WorkoutsIncomplete":
      return "Workouts Incomplete";
    case "WorkoutsComplete":
      return "Workouts Complete";
  }
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: user => dispatch({ type: "SIGN_IN", payload: user }),
    signOut: () => dispatch({ type: "SIGN_OUT" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiftLogger);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
