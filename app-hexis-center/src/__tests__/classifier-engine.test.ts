import { describe, it, expect } from 'vitest';
import {
  classifyRisk,
  inputFromSkipLevel,
  type ClassificationInput,
} from '@/lib/engines/classifier-engine';

// ━━━ HELPER: default input (all "none"/false) ━━━
function baseInput(overrides: Partial<ClassificationInput> = {}): ClassificationInput {
  return {
    prohibitedPractice: 'none',
    isAnnexI: false,
    annexIIIArea: null,
    art6Exception: 'none',
    transparencyCategory: 'none',
    gpaiRole: 'none',
    hasFRIA: false,
    ...overrides,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STEP 1: PROHIBITED PRACTICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Prohibited Practices (Art. 5)', () => {
  it('social scoring → PROHIBITED', () => {
    const result = classifyRisk(baseInput({ prohibitedPractice: 'social_scoring' }));
    expect(result.riskLevel).toBe('prohibited');
    expect(result.displayLevel).toContain('PROHIBITED');
    expect(result.penalty).toContain('€35 million');
    expect(result.penalty).toContain('7%');
    expect(result.deadline).toBe('2025-02-02');
  });

  it('all prohibited practices produce prohibited result', () => {
    const practices = [
      'social_scoring', 'realtime_biometric', 'emotion_workplace',
      'facial_scraping', 'subliminal', 'vulnerability',
      'predictive_policing', 'biometric_categorization',
    ] as const;

    for (const practice of practices) {
      const result = classifyRisk(baseInput({ prohibitedPractice: practice }));
      expect(result.riskLevel).toBe('prohibited');
    }
  });

  it('prohibited overrides everything else', () => {
    const result = classifyRisk(baseInput({
      prohibitedPractice: 'subliminal',
      isAnnexI: true,
      annexIIIArea: 4,
      gpaiRole: 'gpai_systemic',
    }));
    expect(result.riskLevel).toBe('prohibited');
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENARIOS 1-2: ANNEX III
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Annex III High-Risk (Art. 6(2))', () => {
  it('Annex III area selected, no exception → HIGH RISK', () => {
    const result = classifyRisk(baseInput({ annexIIIArea: 4 }));
    expect(result.riskLevel).toBe('high');
    expect(result.displayLevel).toBe('HIGH RISK');
    expect(result.deadline).toBe('2026-08-02');
    expect(result.exposureMapping).toBe('high');
    expect(result.obligations.length).toBe(8); // HIGH_RISK_OBLIGATIONS
  });

  it('all 8 Annex III areas produce high risk', () => {
    for (let area = 1; area <= 8; area++) {
      const result = classifyRisk(baseInput({ annexIIIArea: area as 1|2|3|4|5|6|7|8 }));
      expect(result.riskLevel).toBe('high');
      expect(result.category).toContain(`Area ${area}`);
    }
  });

  it('Annex III + Annex I → note in supplementary', () => {
    const result = classifyRisk(baseInput({ annexIIIArea: 1, isAnnexI: true }));
    expect(result.riskLevel).toBe('high');
    expect(result.supplementary.some(s => s.includes('Annex I'))).toBe(true);
  });

  it('Annex III + FRIA → supplementary includes Art. 27', () => {
    const result = classifyRisk(baseInput({ annexIIIArea: 4, hasFRIA: true }));
    expect(result.supplementary.some(s => s.includes('Art. 27'))).toBe(true);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ART. 6(3) EXCEPTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Art. 6(3) Exception', () => {
  it('Annex III + exception → NOT HIGH-RISK', () => {
    const result = classifyRisk(baseInput({
      annexIIIArea: 3,
      art6Exception: 'narrow_procedural',
    }));
    expect(result.riskLevel).toBe('not_high_risk');
    expect(result.displayLevel).toContain('Art. 6(3)');
    expect(result.exposureMapping).toBe('moderate');
    expect(result.penalty).toContain('€7.5 million');
  });

  it('all 4 exception types produce not_high_risk', () => {
    const exceptions = ['narrow_procedural', 'improve_human', 'detect_patterns', 'preparatory'] as const;
    for (const exc of exceptions) {
      const result = classifyRisk(baseInput({ annexIIIArea: 5, art6Exception: exc }));
      expect(result.riskLevel).toBe('not_high_risk');
    }
  });

  it('"none" exception (profiling) → stays HIGH RISK', () => {
    const result = classifyRisk(baseInput({ annexIIIArea: 4, art6Exception: 'none' }));
    expect(result.riskLevel).toBe('high');
  });

  it('Annex I OVERRIDES Art. 6(3) exception → HIGH RISK', () => {
    const result = classifyRisk(baseInput({
      annexIIIArea: 3,
      art6Exception: 'narrow_procedural',
      isAnnexI: true,
    }));
    expect(result.riskLevel).toBe('high_art6_3_override');
    expect(result.displayLevel).toBe('HIGH RISK');
    expect(result.obligations.length).toBeGreaterThan(8); // HIGH_RISK + Art. 6(4)
    expect(result.supplementary.some(s => s.includes('Annex I'))).toBe(true);
  });

  it('profiling warning in supplementary for exception results', () => {
    const result = classifyRisk(baseInput({
      annexIIIArea: 4,
      art6Exception: 'detect_patterns',
    }));
    expect(result.supplementary.some(s => s.includes('profiling'))).toBe(true);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENARIO 3: ANNEX I ALONE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Annex I Alone (Art. 6(1))', () => {
  it('Annex I, no Annex III → HIGH RISK', () => {
    const result = classifyRisk(baseInput({ isAnnexI: true }));
    expect(result.riskLevel).toBe('high');
    expect(result.deadline).toBe('2027-08-02'); // Later deadline
    expect(result.category).toContain('Annex I');
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENARIOS 4-5: GPAI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('GPAI Classification (Art. 51-56)', () => {
  it('GPAI systemic → highest urgency deadline', () => {
    const result = classifyRisk(baseInput({ gpaiRole: 'gpai_systemic' }));
    expect(result.riskLevel).toBe('gpai_systemic');
    expect(result.deadline).toBe('2025-08-02');
    expect(result.exposureMapping).toBe('high');
    expect(result.obligations.length).toBe(8); // 4 GPAI + 4 systemic
  });

  it('GPAI provider → elevated exposure', () => {
    const result = classifyRisk(baseInput({ gpaiRole: 'gpai_provider' }));
    expect(result.riskLevel).toBe('gpai');
    expect(result.exposureMapping).toBe('elevated');
    expect(result.obligations.length).toBe(4); // GPAI_OBLIGATIONS
  });

  it('GPAI deployer alone → minimal risk + supplementary note', () => {
    const result = classifyRisk(baseInput({ gpaiRole: 'gpai_deployer' }));
    expect(result.riskLevel).toBe('minimal');
    expect(result.supplementary.some(s => s.includes('Art. 51–53'))).toBe(true);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENARIO 6: TRANSPARENCY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Transparency Obligations (Art. 50)', () => {
  it('chatbot → LIMITED RISK', () => {
    const result = classifyRisk(baseInput({ transparencyCategory: 'chatbot' }));
    expect(result.riskLevel).toBe('limited');
    expect(result.exposureMapping).toBe('moderate');
  });

  it('deepfake → LIMITED RISK', () => {
    const result = classifyRisk(baseInput({ transparencyCategory: 'deepfake' }));
    expect(result.riskLevel).toBe('limited');
  });

  it('transparency + high risk → high risk with supplementary', () => {
    const result = classifyRisk(baseInput({
      annexIIIArea: 4,
      transparencyCategory: 'chatbot',
    }));
    expect(result.riskLevel).toBe('high'); // High risk takes precedence
    expect(result.supplementary.some(s => s.includes('Art. 50'))).toBe(true);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENARIO 7: MINIMAL RISK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Minimal Risk (default)', () => {
  it('all "none" → MINIMAL RISK', () => {
    const result = classifyRisk(baseInput());
    expect(result.riskLevel).toBe('minimal');
    expect(result.deadline).toBeNull();
    expect(result.penalty).toBeNull();
    expect(result.exposureMapping).toBe('low');
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KVKK INTEGRATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('KVKK Context', () => {
  it('personal data → KVKK block in result', () => {
    const result = classifyRisk(baseInput({
      annexIIIArea: 4,
      observe: { hasPersonalData: true },
    }));
    expect(result.kvkk).toBeDefined();
    expect(result.kvkk!.scope).toBe('partial');
    expect(result.kvkk!.warnings.some(w => w.includes('KVKK Art. 12'))).toBe(true);
  });

  it('special category data → full scope', () => {
    const result = classifyRisk(baseInput({
      annexIIIArea: 1,
      observe: { hasPersonalData: true, kvkkHasSpecialCategory: true },
    }));
    expect(result.kvkk!.scope).toBe('full');
  });

  it('no personal data → no KVKK block', () => {
    const result = classifyRisk(baseInput());
    expect(result.kvkk).toBeUndefined();
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SKIP WIZARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Skip Wizard Mapping', () => {
  it('skip "prohibited" → produces prohibited result', () => {
    const input = inputFromSkipLevel('prohibited');
    const result = classifyRisk(input);
    expect(result.riskLevel).toBe('prohibited');
  });

  it('skip "high_risk_annex_iii" → produces high result', () => {
    const input = inputFromSkipLevel('high_risk_annex_iii');
    const result = classifyRisk(input);
    expect(result.riskLevel).toBe('high');
  });

  it('skip "minimal" → produces minimal result', () => {
    const input = inputFromSkipLevel('minimal');
    const result = classifyRisk(input);
    expect(result.riskLevel).toBe('minimal');
  });

  it('all skip levels produce valid results', () => {
    const levels = [
      'prohibited', 'high_risk_annex_iii', 'high_risk_annex_i',
      'gpai_systemic', 'gpai_standard', 'transparency', 'minimal',
    ] as const;

    for (const level of levels) {
      const input = inputFromSkipLevel(level);
      const result = classifyRisk(input);
      expect(result.displayLevel).toBeTruthy();
      expect(result.obligations.length).toBeGreaterThan(0);
    }
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLASSIFICATION PATH METADATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Classification Path Metadata', () => {
  it('preserves full classification path in output', () => {
    const input = baseInput({
      annexIIIArea: 4,
      transparencyCategory: 'chatbot',
      hasFRIA: true,
    });
    const result = classifyRisk(input);
    expect(result.classificationPath.annexIIIArea).toBe(4);
    expect(result.classificationPath.transparencyCategory).toBe('chatbot');
    expect(result.classificationPath.hasFRIA).toBe(true);
  });
});
