import { describe, it, expect } from 'vitest';
import { applyPeriods, clientsToStreams, streamsToClients, type IncomeRow } from '../src/engine/periods';
import { defaultInput } from '../src/engine/activity';

const row = (from: number, amount: number, type: IncomeRow['type'] = 'non_eu_company'): IncomeRow => ({ from, amount, type, newcomer7: false });
const amounts = (c: { months: { amount: number }[] }) => c.months.map((m) => m.amount);

describe('income periods', () => {
  it('a raise: each row runs until the next one', () => {
    const [c] = streamsToClients([[row(0, 3000), row(4, 3800)]]);
    expect(amounts(c)).toEqual([3000, 3000, 3000, 3000, 3800, 3800, 3800, 3800, 3800, 3800, 3800, 3800]);
  });
  it('a layoff: a zero row ends the income', () => {
    const [c] = streamsToClients([[row(0, 3000), row(8, 0)]]);
    expect(amounts(c).slice(7)).toEqual([3000, 0, 0, 0, 0]);
  });
  it('a job change to another kind of client becomes a separate client', () => {
    const cs = streamsToClients([[row(0, 3000, 'non_eu_company'), row(6, 2500, 'es_company')]]);
    expect(cs).toHaveLength(2);
    expect(amounts(cs[0]).slice(5, 7)).toEqual([3000, 0]);
    expect(cs[1].type).toBe('es_company');
    expect(amounts(cs[1]).slice(5, 7)).toEqual([0, 2500]);
  });
  it('rows are applied in month order whatever order they were added', () => {
    const [c] = streamsToClients([[row(6, 2000), row(0, 1000)]]);
    expect(amounts(c)[0]).toBe(1000);
    expect(amounts(c)[6]).toBe(2000);
  });
  it('parallel clients are separate streams', () => {
    expect(streamsToClients([[row(0, 1000)], [row(3, 500, 'es_private')]])).toHaveLength(2);
  });
  it('round trip from per-client months', () => {
    const cs = streamsToClients([[row(0, 3000), row(4, 3800), row(8, 0)]]);
    expect(clientsToStreams(cs)).toEqual([[row(0, 3000), row(4, 3800), row(8, 0)]]);
  });
  it('registered this year: the first income month is the registration month', () => {
    const i = { ...defaultInput('2026-11-19'), income: { mode: 'periods' as const, streams: [[row(5, 3000)]] } };
    expect(applyPeriods(i).alta).toEqual({ year: 2026, month: 6 });
  });
  it('registered in an earlier year: income rows leave the registration date alone', () => {
    const i = { ...defaultInput('2026-11-19'), alta: { year: 2023, month: 3 }, income: { mode: 'periods' as const, streams: [[row(5, 3000)]] } };
    expect(applyPeriods(i).alta).toEqual({ year: 2023, month: 3 });
  });
});
