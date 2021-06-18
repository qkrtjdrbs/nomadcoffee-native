import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import { logUserOut } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import useMe from "../hooks/useMe";
import { Ionicons } from "@expo/vector-icons";

const Wrapper = styled.View`
  padding: 25px 20px;
`;
const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
`;
const Username = styled.Text`
  font-weight: 700;
  font-size: 30px;
  margin-left: 20px;
`;
const UserPhoto = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 30px;
`;
const Total = styled.Text`
  font-weight: 700;
  margin: 25px;
`;

export default function Me({ navigation }) {
  const { data } = useMe();
  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, []);
  return (
    <Wrapper>
      <Container>
        {data?.me?.avatarURL ? (
          <UserPhoto source={{ uri: data?.me?.avatarURL }} />
        ) : (
          <Ionicons name="person" size={60} />
        )}
        <Username>{data?.me?.username}</Username>
      </Container>
      <Container>
        <Total>Followers : {data?.me?.totalFollowers}</Total>
        <Total>Following : {data?.me?.totalFollowing}</Total>
      </Container>
      <AuthButton text="Log out" onPress={logUserOut} disabled={false} />
    </Wrapper>
  );
}
