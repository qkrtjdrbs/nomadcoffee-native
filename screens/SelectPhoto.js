import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import { color } from "../color";
import { StatusBar } from "expo-status-bar";

const Container = styled.View`
  flex: 1;
`;
const Top = styled.View`
  flex: 1;
`;
const Bottom = styled.View`
  flex: 1;
`;

const ImageContainer = styled.TouchableOpacity``;
const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;
const PhotoBar = styled.View`
  padding: 12px;
`;
const PhotoBarText = styled.Text`
  font-weight: 700;
  font-size: 22px;
`;

export default function SelectPhoto({ navigation }) {
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [chosenPhoto, setChosenPhoto] = useState("");
  const getPhotos = async () => {
    //Bring up all of user's photos
    const { assets: photos } = await MediaLibrary.getAssetsAsync({
      first: 50,
      sortBy: [[MediaLibrary.SortBy.default, false]],
    });
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
  };
  const getPermissions = async () => {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
    //Verify that you have granted permission to the user
    if ((status === "undetermined" || status === "denied") && canAskAgain) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "undetermined" || status !== "denied") {
        setOk(true);
        getPhotos();
      }
    } else if (status !== "undetermined" || status !== "denied") {
      setOk(true);
      getPhotos();
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);
  const HeaderRight = () => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("UploadForm", {
          file: chosenPhoto,
        })
      }
    >
      <Ionicons
        name={"arrow-forward"}
        color={color.blue}
        size={28}
        style={{ marginRight: 10 }}
      />
    </TouchableOpacity>
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [chosenPhoto]);
  const { width } = useWindowDimensions();
  const choosePhoto = (uri) => {
    setChosenPhoto(uri);
  };
  const renderItem = ({ item: photo }) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / 4, height: 100 }}
      />
      <IconContainer>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={photo.uri === chosenPhoto ? color.blue : "white"}
        />
      </IconContainer>
    </ImageContainer>
  );
  return (
    <Container>
      <StatusBar hidden={false} />
      <Top>
        {chosenPhoto !== "" ? (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width, height: "100%" }}
          />
        ) : null}
      </Top>
      <Bottom>
        <PhotoBar>
          <PhotoBarText>Gallery</PhotoBarText>
        </PhotoBar>
        <FlatList
          data={photos}
          numColumns={4}
          keyExtractor={(photo) => photo.id}
          renderItem={renderItem}
        />
      </Bottom>
    </Container>
  );
}
