export interface CountryDetailVars {
  code: string;
}

export interface CountryDetailResponse {
  country: {
    code: string;
    name: string;
    capital: string;
    currency: string;
    currencies: string[];
    continent: {
      code: string;
      name: string;
    };
    languages: Array<{
      code: string;
      name: string;
      native: string;
    }>;
    emoji: string;
    native: string;
    phone: string;
    phones: string[];
  };
}
