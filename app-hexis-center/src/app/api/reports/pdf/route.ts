/**
 * PDF Report Generation — ORIENT Step 6: Track
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Takes a generated report (from generate-report API) and renders
 * a Hexis-branded A4 PDF using @react-pdf/renderer.
 *
 * POST /api/reports/pdf
 * Body: { report, systemName, riskLevel, score }
 * Returns: application/pdf stream
 */

import { NextResponse } from 'next/server';
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from '@react-pdf/renderer';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

// ━━━ TYPES ━━━

interface ReportMetric {
  label: string;
  value: string;
  trend?: string;
}

interface ReportData {
  audience: string;
  title: string;
  executive_summary: string;
  key_metrics?: ReportMetric[];
  risk_highlights?: string[];
  recommendations?: string[];
  next_review_date?: string;
}

interface PDFRequest {
  report: ReportData;
  systemName: string;
  riskLevel: string;
  score: number;
}

// ━━━ STYLES (Hexis Web Palette) ━━━

const CHARCOAL = '#1C1E23';
const BRASS = '#B2986C';
const STONE = '#686662';
const PAPER = '#F8F7F5';
const INK_SOFT = '#444240';
const INK_MUTED = '#686662';
const RULE = '#D6D4D0';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: CHARCOAL,
    lineHeight: 1.5,
  },
  // Header
  headerBar: {
    borderBottom: `1.5px solid ${CHARCOAL}`,
    paddingBottom: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  brand: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    letterSpacing: 2,
    color: CHARCOAL,
  },
  brandSub: {
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: STONE,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerDate: {
    fontSize: 8,
    color: STONE,
  },
  headerAudience: {
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: BRASS,
    marginTop: 2,
  },
  // Title
  title: {
    fontFamily: 'Times-Roman',
    fontSize: 20,
    color: CHARCOAL,
    marginBottom: 6,
  },
  systemInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  systemLabel: {
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: STONE,
  },
  systemValue: {
    fontSize: 9,
    color: CHARCOAL,
    marginTop: 1,
  },
  riskBadge: {
    fontSize: 8,
    padding: '2 8',
    border: `1px solid ${CHARCOAL}`,
    color: CHARCOAL,
  },
  // Score
  scoreSection: {
    backgroundColor: PAPER,
    border: `1px solid ${RULE}`,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreNumber: {
    fontFamily: 'Times-Roman',
    fontSize: 36,
    color: CHARCOAL,
  },
  scoreLabel: {
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: STONE,
  },
  // Sections
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: BRASS,
    marginBottom: 8,
    marginTop: 20,
  },
  sectionDivider: {
    borderBottom: `0.5px solid ${RULE}`,
    marginBottom: 4,
  },
  // Content
  paragraph: {
    fontSize: 10,
    color: INK_SOFT,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  // Metrics grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    width: '48%',
    border: `1px solid ${RULE}`,
    padding: 10,
  },
  metricLabel: {
    fontSize: 7,
    color: STONE,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: 'Times-Roman',
    fontSize: 16,
    color: CHARCOAL,
  },
  metricTrend: {
    fontSize: 8,
    color: STONE,
    marginTop: 1,
  },
  // Lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  listBullet: {
    width: 12,
    fontSize: 10,
    color: BRASS,
  },
  listNumber: {
    width: 16,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: BRASS,
  },
  listText: {
    flex: 1,
    fontSize: 9,
    color: INK_SOFT,
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    borderTop: `0.5px solid ${RULE}`,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: STONE,
  },
  disclaimer: {
    fontSize: 7,
    color: INK_MUTED,
    marginTop: 20,
    paddingTop: 10,
    borderTop: `0.5px solid ${RULE}`,
    lineHeight: 1.4,
  },
});

// ━━━ AUDIENCE LABELS ━━━

const AUDIENCE_MAP: Record<string, string> = {
  board: 'Board Summary',
  dpo: 'DPO Compliance Report',
  auditor: 'Auditor Evidence Report',
};

const RISK_LABELS: Record<string, string> = {
  prohibited: 'Prohibited',
  high: 'High Risk',
  limited: 'Limited Risk',
  gpai: 'GPAI',
  minimal: 'Minimal Risk',
};

// ━━━ PDF DOCUMENT ━━━

function HexisReport({ report, systemName, riskLevel, score }: PDFRequest) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      // ━━━ HEADER ━━━
      React.createElement(
        View,
        { style: styles.headerBar },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brand }, 'HEXIS'),
          React.createElement(
            Text,
            { style: styles.brandSub },
            'AI Governance Platform'
          )
        ),
        React.createElement(
          View,
          { style: styles.headerRight },
          React.createElement(Text, { style: styles.headerDate }, dateStr),
          React.createElement(
            Text,
            { style: styles.headerAudience },
            AUDIENCE_MAP[report.audience] || report.audience
          )
        )
      ),

      // ━━━ TITLE ━━━
      React.createElement(Text, { style: styles.title }, report.title),

      // ━━━ SYSTEM INFO ━━━
      React.createElement(
        View,
        { style: styles.systemInfo },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.systemLabel }, 'SYSTEM'),
          React.createElement(
            Text,
            { style: styles.systemValue },
            systemName
          )
        ),
        React.createElement(
          View,
          null,
          React.createElement(
            Text,
            { style: styles.systemLabel },
            'RISK LEVEL'
          ),
          React.createElement(
            Text,
            { style: styles.riskBadge },
            RISK_LABELS[riskLevel] || riskLevel
          )
        ),
        React.createElement(
          View,
          null,
          React.createElement(
            Text,
            { style: styles.systemLabel },
            'REPORT DATE'
          ),
          React.createElement(Text, { style: styles.systemValue }, dateStr)
        )
      ),

      // ━━━ COMPLIANCE SCORE ━━━
      React.createElement(
        View,
        { style: styles.scoreSection },
        React.createElement(
          View,
          null,
          React.createElement(
            Text,
            { style: styles.scoreLabel },
            'COMPLIANCE SCORE'
          ),
          React.createElement(
            Text,
            { style: styles.scoreNumber },
            `${Math.round(score)}/100`
          )
        )
      ),

      // ━━━ EXECUTIVE SUMMARY ━━━
      React.createElement(
        View,
        null,
        React.createElement(
          Text,
          { style: styles.sectionLabel },
          'Executive Summary'
        ),
        React.createElement(View, { style: styles.sectionDivider }),
        React.createElement(
          Text,
          { style: styles.paragraph },
          report.executive_summary
        )
      ),

      // ━━━ KEY METRICS ━━━
      ...(report.key_metrics && report.key_metrics.length > 0
        ? [
            React.createElement(
              View,
              { key: 'metrics-section' },
              React.createElement(
                Text,
                { style: styles.sectionLabel },
                'Key Metrics'
              ),
              React.createElement(View, { style: styles.sectionDivider }),
              React.createElement(
                View,
                { style: styles.metricsGrid },
                ...report.key_metrics.map((m, i) =>
                  React.createElement(
                    View,
                    { key: `metric-${i}`, style: styles.metricCard },
                    React.createElement(
                      Text,
                      { style: styles.metricLabel },
                      m.label
                    ),
                    React.createElement(
                      Text,
                      { style: styles.metricValue },
                      m.value
                    ),
                    m.trend
                      ? React.createElement(
                          Text,
                          { style: styles.metricTrend },
                          m.trend === 'improving'
                            ? '↑ Improving'
                            : m.trend === 'declining'
                              ? '↓ Declining'
                              : '→ Stable'
                        )
                      : null
                  )
                )
              )
            ),
          ]
        : []),

      // ━━━ RISK HIGHLIGHTS ━━━
      ...(report.risk_highlights && report.risk_highlights.length > 0
        ? [
            React.createElement(
              View,
              { key: 'risk-section' },
              React.createElement(
                Text,
                { style: styles.sectionLabel },
                'Risk Highlights'
              ),
              React.createElement(View, { style: styles.sectionDivider }),
              ...report.risk_highlights.map((r, i) =>
                React.createElement(
                  View,
                  { key: `risk-${i}`, style: styles.listItem },
                  React.createElement(
                    Text,
                    { style: styles.listBullet },
                    '—'
                  ),
                  React.createElement(Text, { style: styles.listText }, r)
                )
              )
            ),
          ]
        : []),

      // ━━━ RECOMMENDATIONS ━━━
      ...(report.recommendations && report.recommendations.length > 0
        ? [
            React.createElement(
              View,
              { key: 'rec-section' },
              React.createElement(
                Text,
                { style: styles.sectionLabel },
                'Recommendations'
              ),
              React.createElement(View, { style: styles.sectionDivider }),
              ...report.recommendations.map((r, i) =>
                React.createElement(
                  View,
                  { key: `rec-${i}`, style: styles.listItem },
                  React.createElement(
                    Text,
                    { style: styles.listNumber },
                    `${i + 1}.`
                  ),
                  React.createElement(Text, { style: styles.listText }, r)
                )
              )
            ),
          ]
        : []),

      // ━━━ NEXT REVIEW ━━━
      ...(report.next_review_date
        ? [
            React.createElement(
              Text,
              {
                key: 'review',
                style: {
                  fontSize: 8,
                  color: STONE,
                  marginTop: 16,
                },
              },
              `Suggested next review: ${report.next_review_date}`
            ),
          ]
        : []),

      // ━━━ DISCLAIMER ━━━
      React.createElement(
        Text,
        { style: styles.disclaimer },
        'This report is generated by the Hexis AI Governance Platform for informational purposes only. ' +
          'It does not constitute legal advice. Consult qualified legal counsel for compliance decisions. ' +
          'AI-generated insights are based on the EU AI Act (Regulation (EU) 2024/1689) and should be verified ' +
          'against the official text. © Hexis ' +
          now.getFullYear()
      ),

      // ━━━ FOOTER ━━━
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(
          Text,
          { style: styles.footerText },
          'hexis.center — AI Governance Platform'
        ),
        React.createElement(
          Text,
          { style: styles.footerText, render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `${pageNumber} / ${totalPages}` }
        )
      )
    )
  );
}

// ━━━ ZOD SCHEMA ━━━

const ReportMetricSchema = z.object({
  label: z.string().max(200),
  value: z.string().max(200),
  trend: z.enum(['improving', 'declining', 'stable']).optional(),
});

const ReportDataSchema = z.object({
  audience: z.string().max(50),
  title: z.string().max(300),
  executive_summary: z.string().max(10000),
  key_metrics: z.array(ReportMetricSchema).max(20).optional(),
  risk_highlights: z.array(z.string().max(2000)).max(50).optional(),
  recommendations: z.array(z.string().max(2000)).max(50).optional(),
  next_review_date: z.string().max(50).optional(),
});

const PDFRequestSchema = z.object({
  report: ReportDataSchema,
  systemName: z.string().min(1).max(200),
  riskLevel: z.string().max(50),
  score: z.number().min(0).max(100),
});

// ━━━ ROUTE HANDLER ━━━

export async function POST(request: Request) {
  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse & validate body
  let body: PDFRequest;
  try {
    const raw = await request.json();
    body = PDFRequestSchema.parse(raw) as PDFRequest;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { report, systemName, riskLevel, score } = body;

  // 3. Generate PDF
  try {
    const buffer = await renderToBuffer(
      React.createElement(HexisReport, {
        report,
        systemName,
        riskLevel,
        score,
      })
    );

    // 4. Build filename
    const dateSlug = new Date().toISOString().slice(0, 10);
    const nameSlug = systemName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    const filename = `hexis-${report.audience}-${nameSlug}-${dateSlug}.pdf`;

    // 5. Return PDF
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[PDF] Generation failed:', err);
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}
