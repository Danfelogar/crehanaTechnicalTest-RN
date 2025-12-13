export interface Country {
  code: string;
  name: string;
  emoji: string;
  capital: string | null;
  currency: string;
  continent: {
    code: string;
    name: string;
  };
}

export interface CountriesListResponse {
  countries: Country[];
}
