import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabIcon({ iconName, focused }) {
  return (
    <Ionicons name={focused ? iconName : `${iconName}-outline`} size={25} />
  );
}
