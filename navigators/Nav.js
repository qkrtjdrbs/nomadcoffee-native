import React from "react";
import TabIcon from "../components/nav/TabIcon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StackNavs from "./StackNavs";

const Tabs = createBottomTabNavigator();

export default function LoggedInNav() {
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
