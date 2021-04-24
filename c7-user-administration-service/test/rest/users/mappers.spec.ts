
import { StatementResult, Record, Node } from 'neo4j-driver/types/v1';
import RecordObject from 'neo4j-driver/lib/v1/record';
import { Node as NodeObject } from 'neo4j-driver/lib/v1/graph-types';

import { mapNeo4jStatementResultToLoginDetails } from '@/server/v1/rest/users/mappers';
import { LoginDetails, Brand, Persona } from '@/server/v1/rest/users/types';

describe('user mappers', () => {
  it('returns empty array when record has no results', () => {
    const mockEmptyStatementResult: StatementResult = {
      records: [],
      summary: {} as any,
    };
    const mappedResult = mapNeo4jStatementResultToLoginDetails(mockEmptyStatementResult);
    expect(mappedResult.length).toBe(0);
  });

  it('maps records to LoginDetails', () => {
    const mockUserIds = ['a@a.com', 'b@b.com', 'c@c.com'];
    const mockStatementResult: StatementResult = {
      records: getMockUserRecords(mockUserIds),
      summary: {} as any,
    };
    const mappedResult = mapNeo4jStatementResultToLoginDetails(mockStatementResult);

    mockUserIds.forEach((mockId, idx) => {
      const output = mappedResult[idx];
      expect(output.id).toBe(mockUserIds[idx]);
    });
  });
});

function getMockUserRecords(mockUserIds: string[]): Record[] {
  return mockUserIds.map(id => {
    const node = new NodeObject(1, ['User'], getMockUser(id));
    const record: Record = new RecordObject(['user'], [node]) as any;
    return record;
  });
}

function getMockUser(id: string): LoginDetails {
  return {
    lastLogin: 'Thu, 13 Jun 2019 16:17:54 GMT',
    zipCode: '63111',
    persona: Persona.Dealer,
    city: 'Saint Louis',
    last_name: 'Tester',
    hqSapId: '0001013083',
    primary_phone: '3145551212',
    secondary_phone: '',
    contact_glopid: 'f001b55f-6b9f-42aa-81cb-344192648e06',
    address_line_1: '123 Bayer Parkway',
    name: 'Nicolette_DAmore51@gmail.com',
    state: 'MO',
    address_line_2: '',
    id,
    federationId: '6c3cf8de8e9b4312b6aa60c8e8485005',
    brand: Brand.National,
    first_name: 'Karl',
    status: 'active',
  }
}
