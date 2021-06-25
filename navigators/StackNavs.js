import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Me from "../screens/Me";
import PhotoScreen from "../screens/PhotoScreen";

const Stack = createStackNavigator();

export default function StackNavs({ screenName }) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        headerStyle: {
          shadowColor: "rgba(255, 255, 255, 0.5)",
        },
      }}
    >
      {screenName === "Home" ? (
        <Stack.Screen name={"Home"} component={Home} />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="Search" component={Search} />
      ) : null}
      {screenName === "Me" ? (
        <Stack.Screen name="Me" component={isLoggedIn ? Me : Login} />
      ) : null}
      <Stack.Screen name="Profile" component={isLoggedIn ? Profile : Login} />
      <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
    </Stack.Navigator>
  );
}
