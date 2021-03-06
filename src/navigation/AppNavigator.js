import React from "react";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExerciseScreen from "../screens/ExerciseScreen";
import HomeScreen from "../screens/HomeScreen";
import WorkoutScreen from "../screens/WorkoutScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CustomDrawerComponent from "../screens/DrawerNavigator/CustomDrawerComponent";
import WorkoutsIncompleteScreen from "../screens/HomeTabNavigator/WorkoutsIncompleteScreen";
import WorkoutsCompleteScreen from "../screens/HomeTabNavigator/WorkoutsCompleteScreen";
import WorkoutsCountContainer from "../redux/containers/WorkoutsCountContainer";
import WelcomeScreen from "../navigation/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";

import Camera from "../screens/modals/Camera";

import { useNavigation } from "@react-navigation/native";
import colors from "../assets/colors";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const defaultStyle = {
  headerStyle: {
    backgroundColor: colors.bgMain
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    textAlign: "center",
    flexGrow: 1,
    alignSelf: "center"
  }
};

getHeaderTitle = route => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : "Home";

  switch (routeName) {
    case "Home":
      return "Workouts";
    case "Main":
      return "Workouts";
    case "Workout":
      return "Exercises";
    case "Exercise":
      return "Sets";
    case "WorkoutsIncomplete":
      return "Workouts Incomplete";
    case "WorkoutsComplete":
      return "Workouts Complete";
  }
};

export function HomeTabNavigator() {
  return (
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
                <WorkoutsCountContainer
                  color={color}
                  type="workoutsIncomplete"
                />
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
}

export function WorkoutTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: colors.bgMain
        },
        activeTintColor: colors.logoColor,
        inactiveTintColor: colors.bgTextInput
      }}
    >
      <Tab.Screen
        options={{ tabBarLabel: "Exercises" }}
        name="Workout"
        component={WorkoutScreen}
      />
    </Tab.Navigator>
  );
}

export function AuthStack() {
  return (
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
  );
}

export function RootStack() {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Main"
        component={AppStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Camera" component={Camera} />
    </Stack.Navigator>
  );
}

export function AppStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bgMain
        },
        headerTintColor: "white"
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeTabNavigator}
        options={({ route }) => ({
          title: "Workouts",
          headerLeft: () => (
            <Ionicons
              onPress={() => navigation.openDrawer()}
              name="ios-menu"
              size={30}
              color="white"
              style={{ marginLeft: 10 }}
            />
          )
        })}
      />
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerBackTitleVisible: true
        })}
      />
      <Stack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerBackTitleVisible: true
        })}
      />
    </Stack.Navigator>
  );
}

export function SettingsDrawer() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <Ionicons
            onPress={() => navigation.openDrawer()}
            name="ios-menu"
            size={30}
            color="white"
            style={{ marginLeft: 10 }}
          />
        ),
        headerStyle: {
          backgroundColor: colors.bgMain
        },
        headerTintColor: "white"
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          ...defaultStyle
        }}
      />
    </Stack.Navigator>
  );
}
export function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerComponent {...props} />}
    >
      <Drawer.Screen
        options={{ drawerIcon: () => <Ionicons name="ios-home" size={24} /> }}
        name="HomeDrawer"
        component={RootStack}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Ionicons name="ios-settings" size={24} />
        }}
        name="Settings"
        component={SettingsScreen}
      />
    </Drawer.Navigator>
  );
}
