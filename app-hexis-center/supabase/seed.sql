-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HEXIS AI GOVERNANCE PLATFORM — SEED DATA
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Usage: supabase db reset (runs after all migrations)
--
-- Creates a demo environment with:
--   - 1 organisation (Acme Corp)
--   - 1 demo user (demo@hexis.center)
--   - 3 AI systems at different ORIENT stages
--   - Full obligation set for high-risk system
--   - Assessment, actions, and compliance snapshots
--
-- Deterministic UUIDs for reproducibility:
--   org:    '11111111-0000-0000-0000-000000000001'
--   user:   '22222222-0000-0000-0000-000000000001'
--   sys-1:  '33333333-0000-0000-0000-000000000001' (HR Screening — high-risk, full ORIENT)
--   sys-2:  '33333333-0000-0000-0000-000000000002' (Chatbot — limited risk, partial ORIENT)
--   sys-3:  '33333333-0000-0000-0000-000000000003' (Spam Filter — minimal risk, observe only)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ┌─────────────────────────────────┐
-- │  0. CLEANUP (idempotent)        │
-- └─────────────────────────────────┘

-- Delete in reverse dependency order
delete from public.advisor_conversations where system_id in (
  '33333333-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000003'
);
delete from public.compliance_snapshots where org_id = '11111111-0000-0000-0000-000000000001';
delete from public.governance_events where org_id = '11111111-0000-0000-0000-000000000001';
delete from public.api_usage where org_id = '11111111-0000-0000-0000-000000000001';
delete from public.actions where system_id in (
  '33333333-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000003'
);
delete from public.assessments where system_id in (
  '33333333-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000003'
);
delete from public.obligations where system_id in (
  '33333333-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000003'
);
delete from public.risk_classifications where system_id in (
  '33333333-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000003'
);
delete from public.ai_systems where id in (
  '33333333-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000003'
);
delete from public.profiles where id = '22222222-0000-0000-0000-000000000001';
delete from public.organizations where id = '11111111-0000-0000-0000-000000000001';

-- Create demo user in auth.users (Supabase local only)
-- In production, users are created via Supabase Auth
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '22222222-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@hexis.center',
  crypt('demo-password-123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Demo User"}'::jsonb,
  now(),
  now(),
  '', '', '', ''
) on conflict (id) do nothing;

-- ┌─────────────────────────────────┐
-- │  1. ORGANISATION                │
-- └─────────────────────────────────┘

insert into public.organizations (id, name, slug, plan, subscription_status, trial_ends_at)
values (
  '11111111-0000-0000-0000-000000000001',
  'Acme Corp',
  'acme-corp',
  'pro',
  'trialing',
  now() + interval '14 days'
);

-- ┌─────────────────────────────────┐
-- │  2. PROFILE                     │
-- └─────────────────────────────────┘

insert into public.profiles (id, org_id, email, full_name, role, onboarding_completed)
values (
  '22222222-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000001',
  'demo@hexis.center',
  'Demo User',
  'owner',
  true
);

-- ┌─────────────────────────────────┐
-- │  3. AI SYSTEMS (Observe)        │
-- └─────────────────────────────────┘

-- System 1: HR Screening AI — High-risk, full ORIENT journey completed
insert into public.ai_systems (
  id, org_id, name, description, purpose,
  provider, deployment_type, data_types, processes_personal_data, eu_market,
  organisation_role, deployment_status, responsible_person, responsible_unit,
  observe_metadata, next_review_date, review_frequency_days,
  created_by
) values (
  '33333333-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000001',
  'CV Screening Assistant',
  'AI-powered resume screening tool that evaluates job applications using NLP to match candidate qualifications against job requirements. Generates ranked shortlists for hiring managers.',
  'Automated screening and ranking of job applications for open positions',
  'Internal Development Team',
  'internal',
  array['personal_data', 'biometric_data'],
  true,
  true,
  'provider',
  'production',
  'Head of HR Technology',
  'Human Resources',
  '{"ai_component": true, "eu_market_scope": true}'::jsonb,
  (current_date + interval '60 days')::date,
  90,
  '22222222-0000-0000-0000-000000000001'
);

-- System 2: Customer Chatbot — Limited risk, classified but not fully assessed
insert into public.ai_systems (
  id, org_id, name, description, purpose,
  provider, deployment_type, data_types, processes_personal_data, eu_market,
  organisation_role, deployment_status, responsible_person, responsible_unit,
  observe_metadata,
  created_by
) values (
  '33333333-0000-0000-0000-000000000002',
  '11111111-0000-0000-0000-000000000001',
  'Customer Support Chatbot',
  'LLM-based chatbot deployed on the company website to answer customer questions about products and services. Escalates complex queries to human agents.',
  'Automated first-line customer support for product inquiries',
  'Third-party Vendor (ChatCo)',
  'external',
  array['personal_data'],
  true,
  true,
  'deployer',
  'production',
  'CTO',
  'Product Engineering',
  '{"ai_component": true, "eu_market_scope": true}'::jsonb,
  '22222222-0000-0000-0000-000000000001'
);

-- System 3: Spam Filter — Minimal risk, just registered (observe only)
insert into public.ai_systems (
  id, org_id, name, description, purpose,
  provider, deployment_type, data_types, processes_personal_data, eu_market,
  organisation_role, deployment_status,
  observe_metadata,
  created_by
) values (
  '33333333-0000-0000-0000-000000000003',
  '11111111-0000-0000-0000-000000000001',
  'Email Spam Filter',
  'Machine learning model that classifies incoming emails as spam or legitimate. Standard commercial email filtering service.',
  'Classify and filter incoming email for spam detection',
  'Microsoft 365',
  'external',
  array['personal_data'],
  false,
  true,
  'deployer',
  'production',
  '{"ai_component": true, "eu_market_scope": true}'::jsonb,
  '22222222-0000-0000-0000-000000000001'
);

-- ┌─────────────────────────────────┐
-- │  4. RISK CLASSIFICATIONS        │
-- └─────────────────────────────────┘

-- System 1: High-risk (Annex III — employment)
insert into public.risk_classifications (
  id, system_id, risk_level, classification_path, article_references,
  exception_applied, ai_insight, ai_confidence, ai_model,
  classified_at, classified_by
) values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000001',
  'high',
  '{"steps": ["not_prohibited", "not_annex_i", "annex_iii_employment", "no_art6_3_exception"]}'::jsonb,
  array['Art. 6(2)', 'Annex III(4)(a)', 'Art. 9', 'Art. 10', 'Art. 11', 'Art. 26'],
  false,
  '{"summary": "System falls under Annex III Area 4(a): AI systems intended to be used for recruitment or selection of natural persons, for filtering applications or evaluating candidates.", "reasoning": "The CV Screening Assistant processes personal data of job applicants and generates ranked shortlists, directly impacting employment decisions. This clearly falls within the high-risk category for employment-related AI systems."}'::jsonb,
  'clearly_required',
  'claude-3-5-haiku-20241022',
  now() - interval '7 days',
  '22222222-0000-0000-0000-000000000001'
);

-- System 2: Limited risk (transparency obligations)
insert into public.risk_classifications (
  id, system_id, risk_level, classification_path, article_references,
  exception_applied, ai_insight, ai_confidence, ai_model,
  classified_at, classified_by
) values (
  'aaaaaaaa-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000002',
  'limited',
  '{"steps": ["not_prohibited", "not_annex_i", "not_annex_iii", "transparency_art50"]}'::jsonb,
  array['Art. 50(1)'],
  false,
  '{"summary": "Customer-facing chatbot requires transparency disclosure under Art. 50(1) — users must be informed they are interacting with an AI system.", "reasoning": "The chatbot directly interacts with natural persons. Under Art. 50(1), deployers must ensure persons are informed of AI interaction."}'::jsonb,
  'clearly_required',
  'claude-3-5-haiku-20241022',
  now() - interval '3 days',
  '22222222-0000-0000-0000-000000000001'
);

-- ┌─────────────────────────────────┐
-- │  5. OBLIGATIONS (Identify)      │
-- └─────────────────────────────────┘

-- System 1 (high-risk provider): Full obligation set
-- AI Literacy (universal)
insert into public.obligations (system_id, obligation_key, title, description, article_reference, category, applies_to, risk_levels, status, sort_order)
values
  ('33333333-0000-0000-0000-000000000001', 'all_art4_ai_literacy', 'AI Literacy', 'Ensure staff and other persons dealing with the operation and use of AI systems have a sufficient level of AI literacy.', 'Art. 4', 'general_governance', 'all', array['high'], 'completed', 1),
  ('33333333-0000-0000-0000-000000000001', 'provider_art9_risk_management', 'Risk Management System', 'Establish, implement, document and maintain a risk management system throughout the lifecycle of the high-risk AI system.', 'Art. 9', 'risk_management', 'provider', array['high'], 'in_progress', 2),
  ('33333333-0000-0000-0000-000000000001', 'provider_art10_data_governance', 'Data Governance and Management', 'Develop training, validation and testing data sets subject to appropriate data governance and management practices.', 'Art. 10', 'data_governance', 'provider', array['high'], 'in_progress', 3),
  ('33333333-0000-0000-0000-000000000001', 'provider_art11_technical_documentation', 'Technical Documentation', 'Draw up technical documentation before placing on market or putting into service. Keep it up to date.', 'Art. 11', 'technical_documentation', 'provider', array['high'], 'not_started', 4),
  ('33333333-0000-0000-0000-000000000001', 'provider_art12_record_keeping', 'Record-Keeping and Automatic Logging', 'Design and develop the high-risk AI system with capabilities enabling automatic recording of events (logs).', 'Art. 12', 'technical_documentation', 'provider', array['high'], 'completed', 5),
  ('33333333-0000-0000-0000-000000000001', 'provider_art13_transparency', 'Transparency and Information to Deployers', 'Design and develop the system to enable deployers to interpret output and use it appropriately.', 'Art. 13', 'transparency', 'provider', array['high'], 'not_started', 6),
  ('33333333-0000-0000-0000-000000000001', 'provider_art14_human_oversight', 'Human Oversight Measures', 'Design and develop the system so it can be effectively overseen by natural persons during use.', 'Art. 14', 'human_oversight', 'provider', array['high'], 'in_progress', 7),
  ('33333333-0000-0000-0000-000000000001', 'provider_art15_accuracy_robustness', 'Accuracy, Robustness and Cybersecurity', 'Design and develop the system to achieve appropriate levels of accuracy, robustness and cybersecurity.', 'Art. 15', 'technical_documentation', 'provider', array['high'], 'not_started', 8),
  ('33333333-0000-0000-0000-000000000001', 'provider_art17_quality_management', 'Quality Management System', 'Put in place a quality management system ensuring compliance with this Regulation.', 'Art. 17', 'general_governance', 'provider', array['high'], 'not_started', 9),
  ('33333333-0000-0000-0000-000000000001', 'provider_art43_conformity_assessment', 'Conformity Assessment', 'Ensure the high-risk AI system undergoes the relevant conformity assessment procedure prior to market placement.', 'Art. 43', 'conformity_assessment', 'provider', array['high'], 'not_started', 10),
  ('33333333-0000-0000-0000-000000000001', 'provider_art47_eu_declaration', 'EU Declaration of Conformity', 'Draw up an EU declaration of conformity and keep it at the disposal of national competent authorities for 10 years.', 'Art. 47', 'conformity_assessment', 'provider', array['high'], 'not_started', 11),
  ('33333333-0000-0000-0000-000000000001', 'provider_art48_ce_marking', 'CE Marking', 'Affix the CE marking to the high-risk AI system or its packaging or accompanying documentation.', 'Art. 48', 'conformity_assessment', 'provider', array['high'], 'not_started', 12),
  ('33333333-0000-0000-0000-000000000001', 'provider_art49_registration', 'EU Database Registration', 'Register the high-risk AI system in the EU database before placing on the market.', 'Art. 49(1)', 'registration', 'provider', array['high'], 'not_started', 13),
  ('33333333-0000-0000-0000-000000000001', 'provider_art72_post_market_monitoring', 'Post-Market Monitoring System', 'Establish and document a post-market monitoring system proportionate to the nature and risk of the AI system.', 'Art. 72', 'post_market_monitoring', 'provider', array['high'], 'not_started', 14);

-- System 2 (limited risk deployer): Transparency obligations
insert into public.obligations (system_id, obligation_key, title, description, article_reference, category, applies_to, risk_levels, status, sort_order)
values
  ('33333333-0000-0000-0000-000000000002', 'all_art4_ai_literacy', 'AI Literacy', 'Ensure staff dealing with AI systems have sufficient AI literacy.', 'Art. 4', 'general_governance', 'all', array['limited'], 'not_started', 1),
  ('33333333-0000-0000-0000-000000000002', 'transparency_art50_1_ai_interaction', 'Inform Persons of AI Interaction', 'Ensure natural persons are informed they are interacting with an AI system.', 'Art. 50(1)', 'transparency', 'all', array['limited'], 'in_progress', 2),
  ('33333333-0000-0000-0000-000000000002', 'transparency_art50_2_ai_generated_content', 'Mark AI-Generated Content', 'Mark output of AI systems that generate synthetic content in a machine-readable format.', 'Art. 50(2)', 'transparency', 'all', array['limited'], 'not_started', 3),
  ('33333333-0000-0000-0000-000000000002', 'transparency_art50_4_deepfake', 'Label Deep Fake Content', 'Disclose that content has been artificially generated or manipulated.', 'Art. 50(4)', 'transparency', 'all', array['limited'], 'not_started', 4);

-- ┌─────────────────────────────────┐
-- │  6. ASSESSMENT (Evaluate)       │
-- └─────────────────────────────────┘

-- System 1: Governance maturity assessment
insert into public.assessments (
  id, system_id,
  oversight_level, monitoring_level, documentation_level,
  weighted_maturity, activation_posture, urgency_index, risk_exposure,
  ai_insight, ai_model,
  assessed_at, assessed_by
) values (
  'bbbbbbbb-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000001',
  2,  -- Structured oversight
  1,  -- Ad Hoc monitoring
  1,  -- Ad Hoc documentation
  1.46, -- Weighted: (2*1.5 + 1*1.4 + 1*1.0) / 3.9
  'Activation Required — Significant Gaps',
  0.72,
  'high',
  '{"summary": "System has structured oversight processes but monitoring and documentation lag behind. Given the high-risk classification, immediate attention to technical documentation (Art. 11) and monitoring capabilities is needed.", "improvement_targets": ["Establish automated monitoring within 30 days", "Begin technical documentation framework within 14 days", "Formalize quality management system within 60 days"]}'::jsonb,
  'claude-3-5-haiku-20241022',
  now() - interval '5 days',
  '22222222-0000-0000-0000-000000000001'
);

-- ┌─────────────────────────────────┐
-- │  7. ACTIONS (Navigate)          │
-- └─────────────────────────────────┘

-- System 1: Generated action plan
insert into public.actions (
  id, system_id, obligation_id, title, description,
  priority, status, estimated_hours, dimension_impact,
  ai_reasoning, ai_generated, sort_order
) values
  (
    'cccccccc-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Draft Risk Management System Documentation',
    'Create the risk management system document covering risk identification, analysis, estimation and evaluation as required by Art. 9. Include lifecycle approach and residual risk criteria.',
    'critical',
    'in_progress',
    16,
    array['documentation', 'oversight'],
    'Art. 9 is the foundation for high-risk compliance. Without documented risk management, other obligations cannot be meaningfully addressed.',
    true,
    1
  ),
  (
    'cccccccc-0000-0000-0000-000000000002',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Implement Automated Logging System',
    'Set up comprehensive event logging for the CV screening pipeline — inputs, outputs, confidence scores, human override decisions. Art. 12 requires automatic recording throughout lifecycle.',
    'critical',
    'done',
    8,
    array['monitoring', 'documentation'],
    'Logging is prerequisite for both Art. 12 compliance and effective post-market monitoring (Art. 72).',
    true,
    2
  ),
  (
    'cccccccc-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Define Human Oversight Protocol',
    'Document the human oversight protocol: who reviews AI decisions, escalation criteria, override procedures, competency requirements. Map to Art. 14 requirements.',
    'high',
    'in_progress',
    12,
    array['oversight'],
    'Human oversight is the primary safeguard for employment decisions. Current ad-hoc approach needs formalization.',
    true,
    3
  ),
  (
    'cccccccc-0000-0000-0000-000000000004',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Create Data Governance Framework',
    'Establish data governance practices for training data: representativeness, bias testing, data quality metrics. Covers Art. 10 requirements for recruitment context.',
    'high',
    'todo',
    20,
    array['documentation', 'monitoring'],
    'Employment AI carries particular bias risks. Data governance must address demographic representativeness and historical bias in training data.',
    true,
    4
  ),
  (
    'cccccccc-0000-0000-0000-000000000005',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Build Technical Documentation Package (Annex IV)',
    'Compile technical documentation per Annex IV: system description, design specifications, training methodology, validation results, accuracy metrics.',
    'high',
    'todo',
    24,
    array['documentation'],
    'Art. 11 + Annex IV documentation is the most effort-intensive obligation but required before market placement.',
    true,
    5
  ),
  (
    'cccccccc-0000-0000-0000-000000000006',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Conduct AI Literacy Training',
    'Design and deliver AI literacy training for HR team members who interact with the screening system. Cover capabilities, limitations, and proper use per Art. 4.',
    'medium',
    'done',
    4,
    array['oversight'],
    'AI literacy is in force since Feb 2025. Quick win that demonstrates governance maturity.',
    true,
    6
  ),
  (
    'cccccccc-0000-0000-0000-000000000007',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Set Up Post-Market Monitoring Plan',
    'Design a post-market monitoring system: what to monitor, frequency, thresholds for action, reporting cadence. Proportionate to high-risk classification.',
    'medium',
    'todo',
    10,
    array['monitoring'],
    'Art. 72 monitoring must be proportionate. Start with key metrics: accuracy drift, bias indicators, incident reports.',
    true,
    7
  ),
  (
    'cccccccc-0000-0000-0000-000000000008',
    '33333333-0000-0000-0000-000000000001',
    null,
    'Prepare Conformity Assessment Approach',
    'Determine conformity assessment procedure (Art. 43) — internal control or third-party involvement. Prepare evidence package.',
    'low',
    'todo',
    6,
    array['documentation'],
    'Conformity assessment is required before market placement (deadline Aug 2026). Start planning early to avoid last-minute rush.',
    true,
    8
  );

-- ┌─────────────────────────────────┐
-- │  8. COMPLIANCE SNAPSHOTS (Track)│
-- └─────────────────────────────────┘

-- System 1: Historical trend (3 snapshots)
insert into public.compliance_snapshots (
  id, org_id, system_id, score,
  obligations_total, obligations_completed,
  actions_total, actions_completed,
  metadata, score_breakdown, snapshot_at
) values
  (
    'dddddddd-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    18,
    14, 0,
    8, 0,
    '{"orient_steps_completed": 4}'::jsonb,
    '{"obligations": 0, "actions": 0, "maturity": 25, "orient": 67}'::jsonb,
    now() - interval '21 days'
  ),
  (
    'dddddddd-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    32,
    14, 1,
    8, 1,
    '{"orient_steps_completed": 5}'::jsonb,
    '{"obligations": 7, "actions": 12, "maturity": 30, "orient": 83}'::jsonb,
    now() - interval '14 days'
  ),
  (
    'dddddddd-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    41,
    14, 2,
    8, 2,
    '{"orient_steps_completed": 6}'::jsonb,
    '{"obligations": 14, "actions": 25, "maturity": 37, "orient": 100}'::jsonb,
    now() - interval '5 days'
  );

-- Org-level snapshot (aggregated)
insert into public.compliance_snapshots (
  id, org_id, system_id, score,
  obligations_total, obligations_completed,
  actions_total, actions_completed,
  metadata, snapshot_at
) values (
  'dddddddd-0000-0000-0000-000000000004',
  '11111111-0000-0000-0000-000000000001',
  null,
  35,
  18, 2,
  8, 2,
  '{"system_count": 3, "classified_count": 2}'::jsonb,
  now() - interval '5 days'
);

-- ┌─────────────────────────────────┐
-- │  9. GOVERNANCE EVENTS (Audit)   │
-- └─────────────────────────────────┘

insert into public.governance_events (
  org_id, system_id, event_type, orient_step,
  actor_id, new_value, metadata
) values
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'system_created', 'observe',
    '22222222-0000-0000-0000-000000000001',
    '{"name": "CV Screening Assistant"}'::jsonb,
    '{"source": "onboarding"}'::jsonb
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'risk_classified', 'risk',
    '22222222-0000-0000-0000-000000000001',
    '{"risk_level": "high", "confidence": "clearly_required"}'::jsonb,
    '{"article_references": ["Art. 6(2)", "Annex III(4)(a)"]}'::jsonb
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'obligations_mapped', 'identify',
    '22222222-0000-0000-0000-000000000001',
    '{"total": 14, "categories": 8}'::jsonb,
    null
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'assessment_completed', 'evaluate',
    '22222222-0000-0000-0000-000000000001',
    '{"posture": "Activation Required", "urgency_index": 0.72}'::jsonb,
    '{"oversight": 2, "monitoring": 1, "documentation": 1}'::jsonb
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'plan_generated', 'navigate',
    '22222222-0000-0000-0000-000000000001',
    '{"actions_count": 8, "critical": 2, "high": 3}'::jsonb,
    '{"ai_generated": true}'::jsonb
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'obligation_completed', 'identify',
    '22222222-0000-0000-0000-000000000001',
    '{"obligation_key": "all_art4_ai_literacy", "status": "completed"}'::jsonb,
    null
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000002',
    'system_created', 'observe',
    '22222222-0000-0000-0000-000000000001',
    '{"name": "Customer Support Chatbot"}'::jsonb,
    '{"source": "manual"}'::jsonb
  ),
  (
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000002',
    'risk_classified', 'risk',
    '22222222-0000-0000-0000-000000000001',
    '{"risk_level": "limited", "confidence": "clearly_required"}'::jsonb,
    '{"article_references": ["Art. 50(1)"]}'::jsonb
  );

-- ┌────────────────────────────────────────────┐
-- │  SEED COMPLETE                             │
-- │                                            │
-- │  Demo login: demo@hexis.center             │
-- │  Password: demo-password-123               │
-- │                                            │
-- │  3 AI systems at different ORIENT stages:  │
-- │  • CV Screening — high-risk, full journey  │
-- │  • Chatbot — limited risk, partial         │
-- │  • Spam Filter — minimal, observe only     │
-- └────────────────────────────────────────────┘
