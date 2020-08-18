import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CustomDrawerComponent from "../screens/DrawerNavigator/CustomDrawerComponent";
import WorkoutsIncompleteScreen from "../screens/HomeTabNavigator/WorkoutsIncompleteScreen";
import WorkoutsCompleteScreen from "../screens/HomeTabNavigator/WorkoutsCompleteScreen";
import WorkoutsCountContainer from "../redux/containers/WorkoutsCountContainer";

import colors from "../assets/colors";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const defaultStyle = {
  headerTintColor: "#696969",
  headerStyle: {
    backgroundColor: "#fff"
  },
  headerTitleStyle: {
    textAlign: "center",
    flexGrow: 1,
    alignSelf: "center"
  }
};

export function getHeaderTitle(route) {
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
}

export const HomeTabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      style: {
        backgroundColor: colors.bgMain
      },
      activeTintColor: colors.logoColor,
      inactiveTintColor: colors.bgTextInput
    }}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        switch (route.name) {
          case "Workouts":
            return <WorkoutsCountContainer color={color} type="workouts" />;

          case "WorkoutsIncomplete":
            return (
              <WorkoutsCountContainer color={color} type="workoutsIncomplete" />
            );
          case "WorkoutsComplete":
            return (
              <WorkoutsCountContainer color={color} type="workoutsComplete" />
            );
        }
      }
    })}
  >
    <Tab.Screen name="Workouts" component={HomeScreen} />
    <Tab.Screen
      options={{ tabBarLabel: "Workouts Incomplete" }}
      name="WorkoutsIncomplete"
      component={WorkoutsIncompleteScreen}
    />
    <Tab.Screen
      options={{ tabBarLabel: "Workouts Complete" }}
      name="WorkoutsComplete"
      component={WorkoutsCompleteScreen}
    />
  </Tab.Navigator>
);

export const HomeStackNavigator = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.bgMain },
      headerTintColor: "white",
      headerLeft: () => (
        <Ionicons
          onPress={() => navigation.openDrawer()}
          name="ios-menu"
          size={30}
          color="white"
          style={{ marginLeft: 10 }}
        />
      )
    }}
  >
    <Stack.Screen
      options={({ route }) => ({
        title: getHeaderTitle(route)
      })}
      name="Workouts"
      component={HomeTabNavigator}
    />
  </Stack.Navigator>
);

export const AppDrawerNavigator = ({ navigation }) => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerComponent {...props} />}
  >
    <Drawer.Screen
      options={{ drawerIcon: () => <Ionicons name="ios-home" size={24} /> }}
      name="Home"
      component={HomeStackNavigator}
    />
    <Drawer.Screen
      options={{ drawerIcon: () => <Ionicons name="ios-settings" size={24} /> }}
      name="Settings"
      component={SettingsScreen}
    />
  </Drawer.Navigator>
);
