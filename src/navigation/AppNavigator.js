import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import CustomDrawer from "./CustomDrawer.js";

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

const AuthStack = createSwitchNavigator({
  LoginScreen: {
    screen: LoginScreen
  },
  RegisterScreen: {
    screen: RegisterScreen
  }
});

const AppStack = createStackNavigator({
  Home: {
    screen: ProfileScreen,
    navigationOptions: {
      title: "Profile",
      ...defaultStyle
    }
  }
});

const RootStack = createStackNavigator(
  {
    Main: {
      screen: AppStack
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const DrawerNavigation = createDrawerNavigator(
  {
    HomeDrawer: {
      screen: RootStack,
      navigationOptions: {
        drawerLabel: "My Profile"
      }
    }
  },
  {
    contentComponent: CustomDrawer,
    unmountInactiveRoutes: true
  }
);

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default AppNavigator;
