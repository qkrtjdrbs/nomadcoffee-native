import React, { useEffect, useState } from "react";
import { ReactNativeFile } from "apollo-upload-client";
import { useForm } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../color";
import { gql, useMutation } from "@apollo/client";
import { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const CREATE_COFFEESHOP = gql`
  mutation createCoffeeShop(
    $name: String!
    $latitude: String!
    $longitude: String!
    $files: [Upload]
    $categories: [String]
  ) {
    createCoffeeShop(
      name: $name
      latitude: $latitude
      longitude: $longitude
      files: $files
      categories: $categories
    ) {
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
      isMine
      categories {
        slug
      }
    }
  }
`;

const Container = styled.View`
  flex: 1;
  padding: 0px 50px;
`;
const Photo = styled.Image`
  height: 300px;
`;
const InputContainer = styled.View`
  margin-top: 30px;
`;
const Input = styled.TextInput`
  padding: 10px 20px;
  border-radius: 100px;
`;

export default function UploadForm({ route, navigation }) {
  const [location, setLocation] = useState();
  const updateCreateCoffeeShop = (cache, result) => {
    const {
      data: { createCoffeeShop },
    } = result;
    if (createCoffeeShop.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeCoffeeShops(prev) {
            return [createCoffeeShop, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };
  const [createCoffeeShopMutation, { loading }] = useMutation(
    CREATE_COFFEESHOP,
    { update: updateCreateCoffeeShop }
  );
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <Ionicons
        name={"arrow-forward"}
        color={color.blue}
        size={28}
        style={{ marginRight: 10 }}
      />
    </TouchableOpacity>
  );
  const HeaderRightLoading = () => (
    <ActivityIndicator
      size="small"
      color={color.blue}
      style={{ marginRight: 10 }}
    />
  );
  const { register, handleSubmit, setValue, watch } = useForm();
  useEffect(() => {
    register("name");
    register("latitude");
    register("longitude");
    register("categories");
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);
  const onValid = ({ name, latitude, longitude, categories }) => {
    const files = [
      new ReactNativeFile({
        uri: route.params.file,
        name: `123.jpg`,
        type: "image/jpeg",
      }),
    ];
    latitude = String(latitude);
    longitude = String(longitude);
    categories = categories.split(",");
    createCoffeeShopMutation({
      variables: { name, latitude, longitude, categories, files },
    });
  };
  useEffect(() => {
    async function getLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        setValue("latitude", String(location.coords.latitude));
        setValue("longitude", String(location.coords.longitude));
      }
    }
    getLocation();
  }, []);

  return (
    <DismissKeyboard>
      <Container>
        <Photo resizeMode="contain" source={{ uri: route.params.file }} />
        <InputContainer>
          <Input
            placeholder="Write a name..."
            onChangeText={(text) => setValue("name", text)}
          />
          <Input
            placeholder="Write a latitude..."
            onChangeText={(text) => setValue("latitude", text)}
            value={watch("latitude")}
          />
          <Input
            placeholder="Write a longitude..."
            onChangeText={(text) => setValue("longitude", text)}
            value={watch("longitude")}
          />
          <Input
            placeholder="Write a categories..."
            onChangeText={(text) => setValue("categories", text)}
          />
        </InputContainer>
      </Container>
    </DismissKeyboard>
  );
}
