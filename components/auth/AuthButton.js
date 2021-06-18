import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { color } from "../../color";

const Button = styled.TouchableOpacity`
  background-color: ${color.yellow};
  padding: 15px 10px;
  border-radius: 7px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

const ButtonText = styled.Text`
  color: ${color.text};
  font-weight: 600;
  font-size: 16px;
  text-align: center;
`;
//ActivityIndicator : loading animation
export default function AuthButton({ onPress, disabled, text, loading }) {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={color.text} />
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
}
