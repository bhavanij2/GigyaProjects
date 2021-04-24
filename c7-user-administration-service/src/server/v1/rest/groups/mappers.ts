import { StatementResult, Record } from 'neo4j-driver/types/v1';
import { VelocityPermissionRecord, VelocityPermissions } from './types';

export function mapPermissionRecord(statementResult: StatementResult): VelocityPermissionRecord[] {
  return statementResult.records.map((record: Record) => {
    const recordObject: VelocityPermissionRecord = record.toObject();
    return recordObject;
  });
}

export function formatPermissionRecord(records: VelocityPermissionRecord[]): VelocityPermissions {
  // @ts-ignore
  return records.reduce((a, r) => {
    const permissions = r.permissions.map(p => `${p}:${r.access}`);
    if (!a[r.country]) a[r.country] = {};
    if (!a[r.country][r.brand]) a[r.country][r.brand] = {};
    if (!a[r.country][r.brand][r.persona]) a[r.country][r.brand][r.persona] = [];
    const existing = a[r.country][r.brand][r.persona];
    permissions.forEach(p => { if (!existing.includes(p)) existing.push(p) });
    return a;
  }, {});
}
