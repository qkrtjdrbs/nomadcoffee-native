import React from "react";
import TabIcon from "../components/nav/TabIcon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StackNavs from "./StackNavs";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";

const Tabs = createBottomTabNavigator();

export default function TabsNav() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <Tabs.Navigator
      tabBarOptions={{
        style: {
          borderTopColor: "rgba(255, 255, 255, 0.5)",
        },
        showLabel: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={"home"} focused={focused} />
          ),
        }}
      >
        {() => <StackNavs screenName="Home" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={"search"} focused={focused} />
          ),
        }}
      >
        {() => <StackNavs screenName="Search" />}
      </Tabs.Screen>
      {isLoggedIn ? (
        <Tabs.Screen
          name="Camera"
          listeners={({ navigation }) => {
            return {
              tabPress: (e) => {
                e.preventDefault();
                //Tab navigator(Stack Screen) => SelectPhoto(Stack Screen)
                navigation.navigate("Upload");
              },
            };
          }}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName={"add-circle"} focused={focused} />
            ),
          }}
        >
          {() => <StackNavs screenName="Camera" />}
        </Tabs.Screen>
      ) : null}
      <Tabs.Screen
        name="Me"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={"person"} focused={focused} />
          ),
        }}
      >
        {() => <StackNavs screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}
