import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import Photo from "../components/Photo";

const HOME_QUERY = gql`
  query seeCoffeeShops($offset: Int!) {
    seeCoffeeShops(offset: $offset) {
      id
      name
      latitude
      longitude
      user {
        id
        username
        avatarURL
      }
      photos {
        id
        url
      }
      categories {
        id
        name
        slug
      }
    }
  }
`;

export default function Home() {
  const { data, loading, refetch, fetchMore } = useQuery(HOME_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const renderPhoto = ({ item: photo }) => {
    return <Photo {...photo} />;
  };
  const refresh = async () => {
    setRefreshing(true);
    await refetch({ offset: 0 });
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeCoffeeShops?.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: "100%" }}
        data={data?.seeCoffeeShops}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
