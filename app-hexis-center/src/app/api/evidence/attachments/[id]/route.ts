/**
 * DELETE /api/evidence/attachments/:id
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Remove an evidence attachment. If it's a file, also delete from Storage.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: 'Invalid attachment ID' }, { status: 400 });
  }

  // 1. Fetch attachment to get storage_path (if file type)
  const { data: attachment, error: fetchError } = await ctx.supabase
    .from('evidence_attachments')
    .select('id, attachment_type, storage_path')
    .eq('id', id)
    .single();

  if (fetchError || !attachment) {
    return NextResponse.json(
      { error: 'Attachment not found or access denied' },
      { status: 404 },
    );
  }

  // 2. Delete from Storage if it's a file
  if (attachment.attachment_type === 'file' && attachment.storage_path) {
    const { error: storageError } = await ctx.supabase.storage
      .from('evidence')
      .remove([attachment.storage_path]);

    if (storageError) {
      console.error('[evidence/attachments/delete] Storage error:', storageError);
      // Continue with DB delete even if storage fails
    }
  }

  // 3. Delete from DB
  const { error: dbError } = await ctx.supabase
    .from('evidence_attachments')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('[evidence/attachments/delete] DB error:', dbError);
    return NextResponse.json({ error: 'Failed to delete attachment' }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
