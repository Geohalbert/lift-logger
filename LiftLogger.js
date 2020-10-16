import React, { Component } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import colors from "./src/assets/colors";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { RootStack, SettingsDrawer } from "./src/navigation/AppNavigator";

import CustomDrawerComponent from "./src/screens/DrawerNavigator/CustomDrawerComponent";
import WelcomeScreen from "./src/navigation/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
class LiftLogger extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = async () => {
    let unsubscribe;
    try {
      unsubscribe = await firebase.auth().onIdTokenChanged(user => {
        user ? this.props.signIn(user) : this.props.signOut();
        unsubscribe();
      });
    } catch (e) {
      this.props.signOut();
    }
  };

  render() {
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
            <Drawer.Navigator
              drawerContent={props => <CustomDrawerComponent {...props} />}
            >
              <Drawer.Screen
                options={{
                  drawerIcon: () => <Ionicons name="ios-home" size={24} />
                }}
                name="HomeDrawer"
                component={RootStack}
              />
              <Drawer.Screen
                options={{
                  drawerIcon: () => <Ionicons name="ios-settings" size={24} />
                }}
                name="Settings"
                component={SettingsDrawer}
              />
            </Drawer.Navigator>
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
    signIn: user => dispatch({ type: "SET_USER", payload: user }),
    signOut: () => dispatch({ type: "SIGN_OUT" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiftLogger);
