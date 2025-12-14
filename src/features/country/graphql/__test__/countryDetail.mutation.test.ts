import {
  authenticatedDummyClient,
  MOCK_COUNTRY_DETAIL,
} from '../../../../shared';
import { countryDetailQuery } from '../countryDetail.mutation';

jest.mock('../../../../shared', () => ({
  authenticatedDummyClient: {
    query: jest.fn(),
  },
}));

describe('countryDetailQuery', () => {
  const mockQuery = authenticatedDummyClient.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should return country detail data successfully', async () => {
      mockQuery.mockResolvedValue({
        data: MOCK_COUNTRY_DETAIL,
      });

      const result = await countryDetailQuery({ code: 'CO' });

      expect(result).toEqual(MOCK_COUNTRY_DETAIL);
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should use network-only fetch policy', async () => {
      mockQuery.mockResolvedValue({
        data: MOCK_COUNTRY_DETAIL,
      });

      await countryDetailQuery({ code: 'CO' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchPolicy: 'network-only',
        }),
      );
    });
  });

  describe('Sad Path', () => {
    it('should throw error when query fails', async () => {
      const mockError = new Error('Network error');
      mockQuery.mockRejectedValue(mockError);

      await expect(countryDetailQuery({ code: 'CO' })).rejects.toThrow(
        'Network error',
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Failed to fetch');
      mockQuery.mockRejectedValue(networkError);

      await expect(countryDetailQuery({ code: 'CO' })).rejects.toThrow(
        'Failed to fetch',
      );
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockQuery.mockRejectedValue(timeoutError);

      await expect(countryDetailQuery({ code: 'CO' })).rejects.toThrow(
        'Request timeout',
      );
    });
  });
});
