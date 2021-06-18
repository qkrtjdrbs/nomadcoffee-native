import React from "react";
import {
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0px 40px;
`;

const Logo = styled.Image`
  width: 100%;
  max-width: 50%;
  height: 100px;
`;

export default function AuthLayout({ children }) {
  const dismissKeyboard = () => {
    //Let the keyboard disappear when touched outside.
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}
    >
      <Container>
        <Logo
          resizeMode="contain"
          source={require("../../assets/coffeeLogo.png")}
        />
        {children}
      </Container>
    </TouchableWithoutFeedback>
  );
}
