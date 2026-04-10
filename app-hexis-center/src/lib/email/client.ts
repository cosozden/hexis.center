/**
 * Email Client — Resend Integration
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Server-side only. Sends transactional emails via Resend.
 *
 * Email types:
 * - Weekly compliance summary
 * - Deadline reminders (7 days, 3 days, 1 day)
 * - Onboarding welcome
 * - Report ready notification
 */

import { Resend } from 'resend';

// ━━━ CLIENT ━━━

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// ━━━ CONFIG ━━━

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Hexis <noreply@hexis.center>';

// ━━━ TYPES ━━━

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ━━━ SEND FUNCTIONS ━━━

/**
 * Send welcome email after onboarding
 */
export async function sendWelcomeEmail(
  to: string,
  userName: string,
  orgName: string
): Promise<EmailResult> {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to Hexis — ${orgName} is set up`,
      html: welcomeTemplate(userName, orgName),
    });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Email] Welcome email failed:', err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Send deadline reminder
 */
export async function sendDeadlineReminder(
  to: string,
  userName: string,
  systemName: string,
  obligationTitle: string,
  daysLeft: number,
  articleRef: string
): Promise<EmailResult> {
  try {
    const resend = getResend();
    const urgency = daysLeft <= 1 ? 'URGENT' : daysLeft <= 3 ? 'Approaching' : 'Upcoming';
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `[${urgency}] ${obligationTitle} — ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`,
      html: deadlineTemplate(userName, systemName, obligationTitle, daysLeft, articleRef),
    });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Email] Deadline reminder failed:', err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Send weekly compliance summary
 */
export async function sendWeeklySummary(
  to: string,
  userName: string,
  orgName: string,
  summary: WeeklySummaryData
): Promise<EmailResult> {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Hexis Weekly — ${orgName} compliance update`,
      html: weeklySummaryTemplate(userName, orgName, summary),
    });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Email] Weekly summary failed:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ━━━ TYPES FOR TEMPLATES ━━━

export interface WeeklySummaryData {
  systemCount: number;
  overallScore: number | null;
  scoreDelta: number | null;
  obligationsCompleted: number;
  obligationsTotal: number;
  actionsCompleted: number;
  actionsTotal: number;
  upcomingDeadlines: Array<{
    title: string;
    daysLeft: number;
    systemName: string;
  }>;
}

// ━━━ HTML TEMPLATES ━━━
// Hexis Web Palette: inline styles for email compatibility

const STYLES = {
  body: 'font-family: Arial, Helvetica, sans-serif; background-color: #16181C; color: #E8E6E2; margin: 0; padding: 0;',
  container: 'max-width: 560px; margin: 0 auto; padding: 32px 24px;',
  header: 'border-bottom: 1.5px solid #1C1E23; padding-bottom: 16px; margin-bottom: 24px;',
  brand: 'font-family: Georgia, "Times New Roman", serif; font-size: 16px; letter-spacing: 3px; color: #E8E6E2; margin: 0;',
  brandSub: 'font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #8A8884; margin: 4px 0 0;',
  h2: 'font-family: Georgia, "Times New Roman", serif; font-size: 18px; color: #E8E6E2; margin: 0 0 8px;',
  text: 'font-size: 13px; line-height: 1.6; color: #8A8884; margin: 0 0 16px;',
  label: 'font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase; color: #B2986C; margin: 0 0 8px;',
  card: 'background: rgba(232,230,226,0.04); border: 1px solid rgba(232,230,226,0.10); padding: 16px; margin-bottom: 16px;',
  score: 'font-family: Georgia, "Times New Roman", serif; font-size: 32px; color: #E8E6E2;',
  btn: 'display: inline-block; font-size: 11px; letter-spacing: 0.5px; padding: 10px 24px; border: 1px solid #E8E6E2; color: #E8E6E2; text-decoration: none;',
  footer: 'border-top: 0.5px solid rgba(232,230,226,0.10); padding-top: 16px; margin-top: 32px;',
  footerText: 'font-size: 10px; color: #8A8884; line-height: 1.5;',
  urgent: 'color: #ef4444;',
  warning: 'color: #f59e0b;',
} as const;

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${STYLES.body}">
<div style="${STYLES.container}">
  <div style="${STYLES.header}">
    <p style="${STYLES.brand}">HEXIS</p>
    <p style="${STYLES.brandSub}">AI Governance Platform</p>
  </div>
  ${content}
  <div style="${STYLES.footer}">
    <p style="${STYLES.footerText}">
      hexis.center — AI Governance Platform<br>
      <a href="https://app.hexis.center/dashboard/settings" style="color: #8A8884;">Manage email preferences</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

function welcomeTemplate(userName: string, orgName: string): string {
  return emailWrapper(`
    <h2 style="${STYLES.h2}">Welcome, ${userName}</h2>
    <p style="${STYLES.text}">
      Your organisation <strong style="color: #E8E6E2;">${orgName}</strong> is set up on Hexis.
      You're ready to start mapping your AI governance posture.
    </p>
    <div style="${STYLES.card}">
      <p style="${STYLES.label}">Getting Started</p>
      <p style="${STYLES.text}">
        1. Register your AI systems<br>
        2. Run the risk classifier<br>
        3. Review your obligations<br>
        4. Assess your governance maturity<br>
        5. Generate your action plan<br>
        6. Track progress with compliance scores
      </p>
    </div>
    <a href="https://app.hexis.center/dashboard" style="${STYLES.btn}">Open Dashboard</a>
  `);
}

function deadlineTemplate(
  userName: string,
  systemName: string,
  title: string,
  daysLeft: number,
  articleRef: string
): string {
  const urgencyStyle = daysLeft <= 1 ? STYLES.urgent : daysLeft <= 3 ? STYLES.warning : '';
  const urgencyLabel = daysLeft <= 1 ? 'OVERDUE / DUE TODAY' : `${daysLeft} days remaining`;

  return emailWrapper(`
    <p style="${STYLES.label}">Deadline Reminder</p>
    <h2 style="${STYLES.h2}">${title}</h2>
    <div style="${STYLES.card}">
      <p style="${STYLES.text}">
        <strong style="color: #E8E6E2;">System:</strong> ${systemName}<br>
        <strong style="color: #E8E6E2;">Article:</strong> ${articleRef}<br>
        <strong style="${urgencyStyle || 'color: #E8E6E2;'}">Status:</strong>
        <span style="${urgencyStyle}">${urgencyLabel}</span>
      </p>
    </div>
    <p style="${STYLES.text}">
      ${userName}, this obligation requires attention.
      Visit the Hexis platform to review and update its status.
    </p>
    <a href="https://app.hexis.center/dashboard" style="${STYLES.btn}">Review Now</a>
  `);
}

function weeklySummaryTemplate(
  userName: string,
  orgName: string,
  data: WeeklySummaryData
): string {
  const deadlineRows = data.upcomingDeadlines
    .slice(0, 5)
    .map(
      (d) =>
        `<tr>
          <td style="padding: 6px 0; font-size: 12px; color: #E8E6E2; border-bottom: 1px solid rgba(232,230,226,0.06);">${d.title}</td>
          <td style="padding: 6px 0; font-size: 12px; color: #8A8884; border-bottom: 1px solid rgba(232,230,226,0.06); text-align: right;">
            <span style="${d.daysLeft <= 7 ? STYLES.warning : ''}">${d.daysLeft}d</span> · ${d.systemName}
          </td>
        </tr>`
    )
    .join('');

  const scoreDeltaStr = data.scoreDelta
    ? data.scoreDelta > 0
      ? `<span style="color: #10b981;">+${data.scoreDelta}</span>`
      : `<span style="color: #ef4444;">${data.scoreDelta}</span>`
    : '';

  return emailWrapper(`
    <p style="${STYLES.label}">Weekly Summary — ${orgName}</p>
    <h2 style="${STYLES.h2}">Hi ${userName}, here's your week</h2>

    <div style="${STYLES.card}">
      <table style="width: 100%;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0;">
            <p style="${STYLES.label}">Compliance Score</p>
            <span style="${STYLES.score}">${data.overallScore ?? '—'}</span>
            <span style="font-size: 14px; color: #8A8884;">/100</span>
            ${scoreDeltaStr ? `<span style="font-size: 12px; margin-left: 8px;">${scoreDeltaStr} this week</span>` : ''}
          </td>
          <td style="padding: 8px 0; text-align: right; vertical-align: top;">
            <p style="${STYLES.label}">Systems</p>
            <span style="font-family: Georgia, serif; font-size: 24px; color: #E8E6E2;">${data.systemCount}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="${STYLES.card}">
      <p style="${STYLES.label}">Progress</p>
      <p style="font-size: 13px; color: #E8E6E2; margin: 0 0 4px;">
        Obligations: <strong>${data.obligationsCompleted}/${data.obligationsTotal}</strong> completed
      </p>
      <p style="font-size: 13px; color: #E8E6E2; margin: 0;">
        Actions: <strong>${data.actionsCompleted}/${data.actionsTotal}</strong> done
      </p>
    </div>

    ${
      data.upcomingDeadlines.length > 0
        ? `<div style="${STYLES.card}">
            <p style="${STYLES.label}">Upcoming Deadlines</p>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              ${deadlineRows}
            </table>
          </div>`
        : ''
    }

    <a href="https://app.hexis.center/dashboard" style="${STYLES.btn}">Open Dashboard</a>
  `);
}
