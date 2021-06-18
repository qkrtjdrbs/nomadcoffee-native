import React from "react";
import { ActivityIndicator, View } from "react-native";
import { color } from "../color";

export default function ScreenLayout({ loading, children }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? <ActivityIndicator color={color.blue} /> : children}
    </View>
  );
}
