import { authenticatedDummyClient, MOCK_CONTINENTS } from '../../../../shared';
import { GET_CONTINENTS, getContinentsQuery } from '../continents.mutation';

jest.mock('../../../../shared', () => ({
  authenticatedDummyClient: {
    query: jest.fn(),
  },
}));

describe('getContinentsQuery', () => {
  const mockQuery = authenticatedDummyClient.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should return continents data successfully', async () => {
      mockQuery.mockResolvedValue({
        data: { continents: MOCK_CONTINENTS },
      });

      const result = await getContinentsQuery();

      expect(result).toEqual(MOCK_CONTINENTS);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith({
        query: GET_CONTINENTS,
        fetchPolicy: 'cache-first',
      });
    });

    it('should use cache-first fetch policy', async () => {
      mockQuery.mockResolvedValue({
        data: { continents: MOCK_CONTINENTS },
      });

      await getContinentsQuery();

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

      await expect(getContinentsQuery()).rejects.toThrow('Network error');
    });

    it('should throw error when data is null', async () => {
      mockQuery.mockResolvedValue({
        data: null,
      });

      await expect(getContinentsQuery()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      mockQuery.mockRejectedValue(networkError);

      await expect(getContinentsQuery()).rejects.toThrow(
        'Network request failed',
      );
    });
  });
});
