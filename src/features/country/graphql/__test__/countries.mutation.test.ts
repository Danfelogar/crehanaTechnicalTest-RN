import { authenticatedDummyClient, MOCK_COUNTRIES } from '../../../../shared';
import { GET_ALL_COUNTRIES, getCountriesQuery } from '../countries.mutation';

jest.mock('../../../../shared', () => ({
  authenticatedDummyClient: {
    query: jest.fn(),
  },
}));

describe('getCountriesQuery', () => {
  const mockQuery = authenticatedDummyClient.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should return countries data successfully', async () => {
      mockQuery.mockResolvedValue({
        data: { countries: MOCK_COUNTRIES },
      });

      const result = await getCountriesQuery();

      expect(result).toEqual(MOCK_COUNTRIES);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith({
        query: GET_ALL_COUNTRIES,
        fetchPolicy: 'cache-first',
      });
    });

    it('should use cache-first fetch policy', async () => {
      mockQuery.mockResolvedValue({
        data: { countries: MOCK_COUNTRIES },
      });

      await getCountriesQuery();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchPolicy: 'cache-first',
        }),
      );
    });
  });

  describe('Sad Path', () => {
    it('should throw error when query fails', async () => {
      const mockError = new Error('Network error');
      mockQuery.mockRejectedValue(mockError);

      await expect(getCountriesQuery()).rejects.toThrow('Network error');
    });

    it('should throw error when data is null', async () => {
      mockQuery.mockResolvedValue({
        data: null,
      });

      await expect(getCountriesQuery()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Failed to fetch');
      mockQuery.mockRejectedValue(networkError);

      await expect(getCountriesQuery()).rejects.toThrow('Failed to fetch');
    });
  });
});
