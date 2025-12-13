export interface Continent {
  code: string;
  name: string;
}

export interface ContinentsResponse {
  continents: Continent[];
}
