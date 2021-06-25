import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { View, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";

const SEE_COFFEESHOP = gql`
  query seeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      id
      name
      user {
        username
        avatarURL
      }
      photos {
        id
        url
      }
      categories {
        id
        slug
        name
      }
    }
  }
`;

export default function PhotoScreen({ route }) {
  const { data, loading, refetch } = useQuery(SEE_COFFEESHOP, {
    variables: {
      id: route?.params?.photoId,
    },
  });
  const [refreshing, setRefreshing] = useState();
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Photo {...data?.seeCoffeeShop} />
      </ScrollView>
    </ScreenLayout>
  );
}
