import { gql } from "@apollo/client";
import { authenticatedDummyClient } from "../../../shared";
import { ContinentsResponse } from "../model";

export const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
    }
  }
`;

export const getContinentsQuery = async () => {
  const result = await authenticatedDummyClient.query<ContinentsResponse>({
    query: GET_CONTINENTS,
    fetchPolicy: "cache-first", // default behavior not change never
  });
  return result.data!.continents;
};
