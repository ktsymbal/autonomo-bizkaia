import { describe, it, expect } from 'vitest';
import { getParams, rawParams } from '../src/params';

describe('params', () => {
  it('every param has source, status in V|S|P|?, checked ISO date', () => {
    for (const year of [2026, 2027] as const) {
      for (const [k, p] of Object.entries(rawParams(year))) {
        expect(p.source, k).toBeTruthy();
        expect(['V', 'S', 'P', '?'], k).toContain(p.status);
        expect(p.checked, k).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
  it('2026 scale', () => {
    expect(getParams(2026).get('irpf.scale')).toEqual([[0, .23], [18080, .28], [36160, .35], [54240, .40], [77450, .45], [107260, .46], [142960, .47], [208390, .49]]);
  });
  it('RETA tramos', () => {
    const t = getParams(2026).get('reta.tramos');
    expect(t).toHaveLength(15);
    expect(t[14].minBase).toBe(1928.10);
    expect(t[13].minBase).toBe(1732.03);
    expect(t[14].maxBase).toBe(5101.20);
  });
  it('2027 overrides are provisional', () => {
    const r = rawParams(2027);
    expect(r['reta.rate'].value).toBe(.316);
    expect(r['reta.rate'].status).toBe('V'); // MEI 1.0 % fixed by law (LGSS DT 43ª)
    expect(r['reta.tramos'].status).toBe('P');
    expect(r['irpf.scale'].status).toBe('P');
  });
  it('tracks which params were used', () => {
    const p = getParams(2026);
    p.get('irpf.minoracion'); p.get('smi');
    expect(p.used()).toEqual(['irpf.minoracion', 'smi']);
    expect(p.unverifiedUsed()).toEqual(['smi']);
  });
});
