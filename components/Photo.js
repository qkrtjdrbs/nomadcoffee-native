import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  border: 1px solid black;
`;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`;
const Username = styled.Text`
  font-weight: 700;
`;
const File = styled.Image``;

const ExtraContainer = styled.View`
  padding: 10px;
`;

export default function Photo({ id, name, user, photos, categories }) {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 450);
  useEffect(() => {
    photos?.forEach((photo) => {
      Image.getSize(photo.url, () => {
        setImageHeight(height / 3);
      });
    });
  }, [photos]);
  return (
    <Container>
      <Header
        onPress={() =>
          navigation.navigate("Profile", {
            username: user.username,
            id: user.id,
          })
        }
      >
        <UserAvatar resizeMode="cover" source={{ uri: user.avatarURL }} />
        <Username>
          {user.username}'s ☕ {name}
        </Username>
      </Header>
      {photos?.map((photo) => {
        return (
          <File
            key={photo.id}
            resizeMode="contain"
            style={{ width, height: imageHeight }}
            source={{ uri: photo?.url }}
          />
        );
      })}
      <ExtraContainer>
        <Text>
          Categories :{" "}
          {categories?.length ? (
            categories.map((c) =>
              c.slug.length ? c.slug : <Text key={c.id}>❌</Text>
            )
          ) : (
            <Text>❌</Text>
          )}
        </Text>
      </ExtraContainer>
    </Container>
  );
}

Photo.propTypes = {
  name: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatarURL: PropTypes.string,
  }).isRequired,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
};
