import { describe, it, expect } from 'vitest';
import { encode, decode } from '../src/state/url';
import { defaultInput } from '../src/engine/activity';
import type { CalcInput } from '../src/engine/types';

const asOf = '2026-11-18';

describe('URL fragment state', () => {
  it('round trip, including Cyrillic names', () => {
    const i = { ...defaultInput(asOf), rentMonthly: 650, clients: [{ ...defaultInput(asOf).clients[0], name: 'Клієнт №1' }] };
    expect(decode(encode(i), asOf)).toEqual(i);
  });
  it('garbage → defaults', () => {
    expect(decode('#calc=%%%not-base64', asOf)).toEqual(defaultInput(asOf));
    expect(decode('', asOf)).toEqual(defaultInput(asOf));
    expect(decode('#something-else', asOf)).toEqual(defaultInput(asOf));
  });
  it('unknown version → defaults', () => {
    const bad = encode(defaultInput(asOf)).replace('#calc=', '');
    const json = JSON.parse(Buffer.from(bad, 'base64url').toString('utf8'));
    json.v = 99;
    expect(decode('#calc=' + Buffer.from(JSON.stringify(json)).toString('base64url'), asOf)).toEqual(defaultInput(asOf));
  });
  it('missing or wrong-typed fields are filled from defaults; asOf is always today', () => {
    const partial = Buffer.from(JSON.stringify({ v: 1, d: { rentMonthly: 500, under36: 'yes', asOf: '2020-01-01' } })).toString('base64url');
    const r = decode('#calc=' + partial, asOf);
    expect(r.rentMonthly).toBe(500);
    expect(r.under36).toBe(false);
    expect(r.asOf).toBe(asOf);
    expect(r.clients).toEqual(defaultInput(asOf).clients);
  });
  it('a stored "not registered yet" (alta null) survives the round trip', () => {
    const i = { ...defaultInput(asOf), alta: null };
    expect(decode(encode(i), asOf).alta).toBeNull();
  });
  it('defaults to registered since January of the current year', () => {
    expect(defaultInput(asOf).alta).toEqual({ year: 2026, month: 1 });
    expect(defaultInput(asOf).year).toBe(2026);
  });
  it('links made before currencies were removed still open', () => {
    const old = { ...defaultInput(asOf), fx: { EUR: 1, USD: 5 }, fxDate: '2026-11-18' } as unknown as CalcInput;
    const out = decode(encode(old), asOf);
    expect('fx' in out).toBe(false);
    expect(out.clients).toEqual(defaultInput(asOf).clients);
  });
});
