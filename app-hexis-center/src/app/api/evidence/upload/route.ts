/**
 * POST /api/evidence/upload
 * ━━━━━━━━━━━━━━━━━━━━━━━━━
 * Upload a file to Supabase Storage and create an attachment record.
 * Accepts multipart/form-data with fields:
 *   - file: File (required)
 *   - obligationId: string UUID (required)
 *   - systemId: string UUID (required, for storage path)
 *   - evidenceItemId: string UUID (optional)
 *   - description: string (optional)
 *
 * Storage path: {org_id}/{system_id}/{obligation_id}/{filename}
 * Max 10MB, restricted MIME types (see migration 004).
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'text/plain',
  'text/csv',
]);

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 1. Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const obligationId = formData.get('obligationId') as string | null;
  const systemId = formData.get('systemId') as string | null;
  const evidenceItemId = formData.get('evidenceItemId') as string | null;
  const description = formData.get('description') as string | null;

  // 2. Validate required fields
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }
  if (!obligationId || !z.string().uuid().safeParse(obligationId).success) {
    return NextResponse.json({ error: 'obligationId is required (valid UUID)' }, { status: 400 });
  }
  if (!systemId || !z.string().uuid().safeParse(systemId).success) {
    return NextResponse.json({ error: 'systemId is required (valid UUID)' }, { status: 400 });
  }

  // 3. Validate file constraints
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `File type not allowed: ${file.type}. Allowed: PDF, Word, Excel, PNG, JPEG, TXT, CSV` },
      { status: 400 },
    );
  }

  // 4. Build storage path: {org_id}/{system_id}/{obligation_id}/{timestamp}-{filename}
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${ctx.orgId}/${systemId}/${obligationId}/${timestamp}-${safeName}`;

  // 5. Upload to Supabase Storage
  const fileBuffer = await file.arrayBuffer();
  const { error: uploadError } = await ctx.supabase.storage
    .from('evidence')
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('[evidence/upload] Storage error:', uploadError);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }

  // 6. Create attachment record
  const { data: attachment, error: dbError } = await ctx.supabase
    .from('evidence_attachments')
    .insert({
      obligation_id: obligationId,
      evidence_item_id: evidenceItemId && z.string().uuid().safeParse(evidenceItemId).success
        ? evidenceItemId
        : null,
      attachment_type: 'file',
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      description: description ?? null,
      uploaded_by: ctx.userId,
    })
    .select('*')
    .single();

  if (dbError) {
    console.error('[evidence/upload] DB error:', dbError);
    // Attempt to clean up uploaded file
    await ctx.supabase.storage.from('evidence').remove([storagePath]);
    return NextResponse.json({ error: 'Failed to create attachment record' }, { status: 500 });
  }

  return NextResponse.json({ attachment }, { status: 201 });
}
