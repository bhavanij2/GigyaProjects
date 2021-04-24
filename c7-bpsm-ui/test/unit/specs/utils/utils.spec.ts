import { formatSapId } from '@/utils/utils';

describe('utils', () => {
  describe('formatSapId', () => {
    it('removes all leading 0s for sapids with 7 digits', () => {
      const mockSapId = '0007654321';
      const expected = '7654321';
      const formattedSapId = formatSapId(mockSapId);
      expect(formattedSapId).toBe(expected);
    });
  
    it('removes all leading 0s even if sapid has 0s in the last 7 digits ', () => {
      const mockSapId = '0000054321';
      const expected = '54321';
      const formattedSapId = formatSapId(mockSapId);
      expect(formattedSapId).toBe(expected);
    });

    it('shows all 10 digits when there are no leading 0s', () => {
      const mockSapId = '9876543210';
      const expected = mockSapId;
      const formattedSapId = formatSapId(mockSapId);
      expect(formattedSapId).toBe(expected);
    });

    it('only removes leading 0s', () => {
      const mockSapId = '0007000000';
      const expected = '7000000';
      const formattedSapId = formatSapId(mockSapId);
      expect(formattedSapId).toBe(expected);
    });
  });
});
