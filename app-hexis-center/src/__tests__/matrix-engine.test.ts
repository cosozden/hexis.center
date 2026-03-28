import { describe, it, expect } from 'vitest';
import {
  computeWeightedMaturity,
  computeUrgency,
  computeThirtyDayTarget,
  generateMatrix,
  computeDelta,
  MATURITY_LEVELS,
  EXPOSURE_LEVELS,
  type MatrixInput,
} from '@/lib/engines/matrix-engine';

// ━━━ HELPER ━━━
function matrixInput(overrides: Partial<MatrixInput> = {}): MatrixInput {
  return {
    exposure: 'moderate',
    oversight: 'structured',
    monitoring: 'structured',
    documentation: 'structured',
    ...overrides,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WEIGHTED MATURITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Weighted Maturity Calculation', () => {
  it('all same level → that level', () => {
    for (const level of MATURITY_LEVELS) {
      const result = computeWeightedMaturity(level, level, level);
      expect(result.maturity).toBe(level);
      expect(result.safeguardApplied).toBe(false);
    }
  });

  it('oversight weighted highest (1.5)', () => {
    // High oversight should pull average up
    const highOversight = computeWeightedMaturity('embedded', 'absent', 'absent');
    const highDoc = computeWeightedMaturity('absent', 'absent', 'embedded');
    // Both have absent → safeguard applies, both capped at adhoc
    // But raw scores differ
    expect(highOversight.rawScore).toBeGreaterThan(highDoc.rawScore);
  });

  it('monitoring weighted second (1.4)', () => {
    const highMonitoring = computeWeightedMaturity('structured', 'embedded', 'structured');
    const highDoc = computeWeightedMaturity('structured', 'structured', 'embedded');
    expect(highMonitoring.rawScore).toBeGreaterThan(highDoc.rawScore);
  });

  it('example: continuous/structured/adhoc → structured', () => {
    // (3×1.5 + 2×1.4 + 1×1.0) / 3.9 = (4.5+2.8+1.0)/3.9 = 2.13 → rounds to 2 → structured
    const result = computeWeightedMaturity('continuous', 'structured', 'adhoc');
    expect(result.maturity).toBe('structured');
    expect(result.rawScore).toBeCloseTo(2.13, 1);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MINIMUM SAFEGUARD PRINCIPLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Minimum Safeguard Principle', () => {
  it('any absent dimension caps maturity at adhoc', () => {
    const result = computeWeightedMaturity('embedded', 'embedded', 'absent');
    expect(result.safeguardApplied).toBe(true);
    expect(result.maturity).toBe('adhoc');
    expect(result.absentDimensions).toContain('documentation');
  });

  it('absent oversight triggers safeguard', () => {
    const result = computeWeightedMaturity('absent', 'continuous', 'continuous');
    expect(result.safeguardApplied).toBe(true);
    expect(result.maturity).toBe('adhoc');
    expect(result.absentDimensions).toContain('oversight');
  });

  it('absent monitoring triggers safeguard', () => {
    const result = computeWeightedMaturity('continuous', 'absent', 'continuous');
    expect(result.safeguardApplied).toBe(true);
    expect(result.maturity).toBe('adhoc');
  });

  it('all absent → absent (no cap needed, already at bottom)', () => {
    const result = computeWeightedMaturity('absent', 'absent', 'absent');
    expect(result.maturity).toBe('absent');
    expect(result.safeguardApplied).toBe(false); // Can't cap below adhoc
  });

  it('absent + adhoc = adhoc (safeguard not triggered because computed ≤ adhoc)', () => {
    const result = computeWeightedMaturity('adhoc', 'absent', 'adhoc');
    // (1×1.5 + 0×1.4 + 1×1.0) / 3.9 = 2.5/3.9 ≈ 0.64 → rounds to 1 → adhoc
    expect(result.maturity).toBe('adhoc');
    // Safeguard: computed is adhoc (index 1), which is ≤ 1, so NOT applied
    expect(result.safeguardApplied).toBe(false);
  });

  it('reports which dimensions are absent', () => {
    const result = computeWeightedMaturity('absent', 'embedded', 'absent');
    expect(result.absentDimensions).toEqual(['oversight', 'documentation']);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// URGENCY INDEX
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Urgency Index', () => {
  it('high exposure + absent maturity → critical', () => {
    // 3×1.6 - 0×0.8 = 4.8 → critical
    const result = computeUrgency('absent', 'high');
    expect(result.level).toBe('critical');
    expect(result.score).toBeCloseTo(4.8);
  });

  it('elevated exposure + structured maturity → moderate', () => {
    // 2×1.6 - 2×0.8 = 3.2-1.6 = 1.6 → moderate
    const result = computeUrgency('structured', 'elevated');
    expect(result.level).toBe('moderate');
  });

  it('low exposure + embedded maturity → minimal', () => {
    // 0×1.6 - 4×0.8 = -3.2 → minimal
    const result = computeUrgency('embedded', 'low');
    expect(result.level).toBe('minimal');
    expect(result.score).toBeLessThan(0);
  });

  it('moderate exposure + adhoc → moderate', () => {
    // 1×1.6 - 1×0.8 = 0.8 → low (≥0.5, <1.5)
    const result = computeUrgency('adhoc', 'moderate');
    expect(result.level).toBe('low');
  });

  it('high exposure + adhoc → high', () => {
    // 3×1.6 - 1×0.8 = 4.8-0.8 = 4.0 → high (≥3, <4.5)
    const result = computeUrgency('adhoc', 'high');
    expect(result.level).toBe('high');
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 30-DAY TARGET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('30-Day Target', () => {
  it('advances each dimension by one level', () => {
    const target = computeThirtyDayTarget('structured', 'adhoc', 'absent');
    expect(target.oversight).toBe('continuous');
    expect(target.monitoring).toBe('structured');
    expect(target.documentation).toBe('adhoc');
  });

  it('caps at embedded', () => {
    const target = computeThirtyDayTarget('embedded', 'embedded', 'embedded');
    expect(target.oversight).toBe('embedded');
    expect(target.monitoring).toBe('embedded');
    expect(target.documentation).toBe('embedded');
  });

  it('summary includes all three targets', () => {
    const target = computeThirtyDayTarget('absent', 'absent', 'absent');
    expect(target.summary).toContain('Ad Hoc');
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FULL MATRIX GENERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Full Matrix Generation', () => {
  it('all 20 posture combinations produce valid results', () => {
    for (const maturity of MATURITY_LEVELS) {
      for (const exposure of EXPOSURE_LEVELS) {
        const result = generateMatrix({
          exposure,
          oversight: maturity,
          monitoring: maturity,
          documentation: maturity,
        });
        expect(result.posture.action).toBeTruthy();
        expect(result.posture.hint).toBeTruthy();
        expect(result.immediateAction).toBeTruthy();
        expect(result.reasoning.regulatorySignal).toBeTruthy();
        expect(result.reasoning.maturityGap).toBeTruthy();
      }
    }
  });

  it('high exposure + absent → Intervene', () => {
    const result = generateMatrix(matrixInput({
      exposure: 'high',
      oversight: 'absent',
      monitoring: 'absent',
      documentation: 'absent',
    }));
    expect(result.posture.action).toContain('Intervene');
    expect(result.urgencyIndex).toBe('critical');
  });

  it('low exposure + embedded → Maintain', () => {
    const result = generateMatrix(matrixInput({
      exposure: 'low',
      oversight: 'embedded',
      monitoring: 'embedded',
      documentation: 'embedded',
    }));
    expect(result.posture.action).toContain('Maintain');
    expect(result.urgencyIndex).toBe('minimal');
  });

  it('safeguard applied → noted in reasoning', () => {
    const result = generateMatrix(matrixInput({
      exposure: 'high',
      oversight: 'embedded',
      monitoring: 'embedded',
      documentation: 'absent',
    }));
    expect(result.safeguardApplied).toBe(true);
    expect(result.reasoning.safeguardNote).toContain('minimum safeguard');
  });

  it('dimension flags present when absent', () => {
    const result = generateMatrix(matrixInput({
      exposure: 'moderate',
      oversight: 'absent',
      monitoring: 'structured',
      documentation: 'absent',
    }));
    expect(result.reasoning.dimensionFlags.length).toBe(2);
    expect(result.reasoning.dimensionFlags.some(f => f.includes('oversight'))).toBe(true);
    expect(result.reasoning.dimensionFlags.some(f => f.includes('documentation'))).toBe(true);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DELTA COMPARISON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Delta Comparison', () => {
  it('improvement detected', () => {
    const prev = generateMatrix(matrixInput({
      oversight: 'adhoc', monitoring: 'adhoc', documentation: 'adhoc',
    }));
    const curr = generateMatrix(matrixInput({
      oversight: 'structured', monitoring: 'structured', documentation: 'structured',
    }));
    const delta = computeDelta(prev, curr);
    expect(delta.maturityChange).toBeGreaterThan(0);
    expect(delta.summary).toContain('improved');
  });

  it('no change detected', () => {
    const prev = generateMatrix(matrixInput());
    const curr = generateMatrix(matrixInput());
    const delta = computeDelta(prev, curr);
    expect(delta.maturityChange).toBe(0);
    expect(delta.urgencyChange).toBe('unchanged');
  });

  it('decline detected', () => {
    const prev = generateMatrix(matrixInput({
      oversight: 'continuous', monitoring: 'continuous', documentation: 'continuous',
    }));
    const curr = generateMatrix(matrixInput({
      oversight: 'adhoc', monitoring: 'adhoc', documentation: 'adhoc',
    }));
    const delta = computeDelta(prev, curr);
    expect(delta.maturityChange).toBeLessThan(0);
  });
});
