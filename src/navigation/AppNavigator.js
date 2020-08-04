import { createSwitchNavigator, createAppContainer } from "react-navigation";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: {
      screen: LoginScreen
    },
    RegisterScreen: {
      screen: RegisterScreen
    },
    ProfileScreen: {
      screen: ProfileScreen
    }
  },
  {
    initialRouteName: "LoginScreen"
  }
);

const AppNavigator = createAppContainer(SwitchNavigator);

export default AppNavigator;
