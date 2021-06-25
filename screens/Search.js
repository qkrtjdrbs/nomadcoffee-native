import { useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
  Image,
} from "react-native";
import styled from "styled-components/native";
import { color } from "../color";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
import PhotoScreen from "./PhotoScreen";

const SEARCH_QUERY = gql`
  query searchCoffeeShop($keyword: String!) {
    searchCoffeeShop(keyword: $keyword) {
      id
      name
      user {
        name
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

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const MessageText = styled.Text`
  margin-top: 15px;
  color: black;
  font-weight: 600;
`;

const Input = styled.TextInput``;

export default function Search({ navigation }) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called, refetch }] = useLazyQuery(
    SEARCH_QUERY,
    {
      variables: {
        keyword: watch("keyword"),
      },
    }
  );
  const onValid = ({ keyword }) => {
    startQueryFn({
      variables: {
        keyword,
      },
    });
  };
  const SearchBox = () => (
    <Input
      placeholder="Search Coffee Shops"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text) => setValue("keyword", text)}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );
  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword", {
      require: true,
      minLength: 2,
    });
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PhotoScreen", { photoId: photo.id })}
    >
      <Text style={{ fontSize: 30 }}>{photo.name}</Text>
    </TouchableOpacity>
  );
  return (
    <DismissKeyboard>
      <View style={{ flex: 1 }}>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator color={color.blue} size="large" />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        ) : null}
        {data?.searchCoffeeShop !== undefined ? (
          data?.searchCoffeeShop?.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything</MessageText>
            </MessageContainer>
          ) : (
            <ScreenLayout loading={loading}>
              <Text style={{ fontWeight: "700", fontSize: 50 }}>Cafe name</Text>
              <FlatList
                refreshing={refreshing}
                onRefresh={refresh}
                data={data?.searchCoffeeShop}
                keyExtractor={(photo) => "" + photo.id}
                renderItem={renderItem}
              />
            </ScreenLayout>
          )
        ) : null}
      </View>
    </DismissKeyboard>
  );
}
