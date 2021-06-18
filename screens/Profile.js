import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import { logUserOut } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import { Ionicons } from "@expo/vector-icons";

const Wrapper = styled.View`
  padding: 15px;
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

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      avatarURL
      totalFollowers
      totalFollowing
      isMe
    }
  }
`;

export default function Profile({ route, navigation }) {
  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route.params.username,
      });
    }
  }, []);
  const { data } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: route?.params?.username,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <Wrapper>
      <Container>
        {data?.seeProfile?.avatarURL ? (
          <UserPhoto source={{ uri: data?.seeProfile?.avatarURL }} />
        ) : (
          <Ionicons name="person" size={60} />
        )}
        <Username>{route?.params?.username}</Username>
      </Container>
      <Container>
        <Total>Followers : {data?.seeProfile?.totalFollowers}</Total>
        <Total>Following : {data?.seeProfile?.totalFollowing}</Total>
      </Container>
      <Container></Container>
      {data?.seeProfile?.isMe ? (
        <AuthButton text="Log out" onPress={logUserOut} disabled={false} />
      ) : null}
    </Wrapper>
  );
}
