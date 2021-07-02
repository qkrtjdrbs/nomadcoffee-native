import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function UploadNav() {
  return (
    <Tab.Navigator tabBarPosition="bottom">
      <Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerBackImage: ({ tintColor }) => (
                <Ionicons color={tintColor} name="close" size={40} />
              ),
            }}
          >
            <Stack.Screen
              name="Select"
              options={{
                title: "New Post",
                headerTitleStyle: {
                  fontWeight: "700",
                },
              }}
              component={SelectPhoto}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto}></Tab.Screen>
    </Tab.Navigator>
  );
}
