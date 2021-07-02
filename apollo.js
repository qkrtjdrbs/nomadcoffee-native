import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  useReactiveVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { offsetLimitPagination } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUploadLink } from "apollo-upload-client";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token) => {
  //Async storage simular to local storage
  await AsyncStorage.setItem("token", JSON.stringify(token));
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  //Async storage simular to local storage
  await AsyncStorage.removeItem("token");
  isLoggedInVar(false);
  tokenVar("");
};

const httpLink = createUploadLink({
  uri: "http://b29a78d0dfac.ngrok.io/graphql",
});

const onErrorLink = onError((error) => {
  console.log(error);
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      //get current token
      token: tokenVar(),
    },
  };
});

const httpLinks = authLink.concat(onErrorLink).concat(httpLink);

const client = new ApolloClient({
  link: httpLinks,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          //It prevents Apollo from distinguishing seeFeed queries according to arguments.
          //It combines old data with new data.
          seeCoffeeShops: offsetLimitPagination(),
        },
      },
      CoffeeShop: {
        fields: {
          user: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
