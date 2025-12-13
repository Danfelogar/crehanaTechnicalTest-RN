import { gql } from '@apollo/client';
import { authenticatedDummyClient } from '../../../shared';
import { CountryDetailResponse, CountryDetailVars } from '../model';

export const GET_COUNTRY_DETAIL = gql`
  query GetCountryDetail($code: ID!) {
    country(code: $code) {
      code
      name
      capital
      currency
      currencies
      continent {
        code
        name
      }
      languages {
        code
        name
        native
      }
      emoji
      native
      phone
      phones
    }
  }
`;

export const countryDetailQuery = async (variables: CountryDetailVars) => {
  const result = await authenticatedDummyClient.query<
    CountryDetailResponse,
    CountryDetailVars
  >({
    query: GET_COUNTRY_DETAIL,
    fetchPolicy: 'network-only',
    variables,
  });

  return result.data!;
};
