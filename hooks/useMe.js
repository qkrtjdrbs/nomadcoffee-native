import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserIn, logUserOut, tokenVar } from "../apollo";

export const ME_QUERY = gql`
  query me {
    me {
      username
      avatarURL
      totalFollowing
      totalFollowers
    }
  }
`;

function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);
  //if not logged in, skip
  //Just in case the token is broken, ME_QUERY does not use Apollo Client cache.
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  return { data };
}

export default useMe;
