import { gql } from '@apollo/client';
import { authenticatedDummyClient } from '../../../shared';
import { CountriesListResponse, Country } from '../model';

export const GET_ALL_COUNTRIES = gql`
  query GetAllCountries {
    countries {
      code
      name
      emoji
      capital
      currency
      continent {
        code
        name
      }
    }
  }
`;

export const getCountriesQuery = async (): Promise<Country[]> => {
  const result = await authenticatedDummyClient.query<CountriesListResponse>({
    query: GET_ALL_COUNTRIES,
    fetchPolicy: 'cache-first',
  });

  return result.data!.countries;
};
