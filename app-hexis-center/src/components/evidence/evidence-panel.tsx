"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, Button, Separator } from "@/components/ui";
import type { Database } from "@/types/database";

// ━━━ TYPES ━━━

type EvidenceItem = Database["public"]["Tables"]["evidence_items"]["Row"];
type EvidenceAttachment = Database["public"]["Tables"]["evidence_attachments"]["Row"];

interface Props {
  obligationId: string;
  systemId: string;
  /** Denormalized counters from obligations table */
  itemsTotal: number;
  itemsCompleted: number;
  attachmentsCount: number;
}

// ━━━ EVIDENCE PANEL ━━━

export function EvidencePanel({
  obligationId,
  systemId,
  itemsTotal,
  itemsCompleted,
  attachmentsCount,
}: Props) {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [attachments, setAttachments] = useState<EvidenceAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [addingLink, setAddingLink] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch data on mount ──
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obligationId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsResp, attachResp] = await Promise.all([
        fetch(`/api/evidence/items?obligationId=${obligationId}`),
        fetch(`/api/evidence/attachments?obligationId=${obligationId}`),
      ]);
      if (itemsResp.ok) {
        const data = await itemsResp.json();
        setItems(data.items);
      }
      if (attachResp.ok) {
        const data = await attachResp.json();
        setAttachments(data.attachments);
      }
    } catch {
      // Silent — counters from parent still show
    } finally {
      setLoading(false);
    }
  }, [obligationId]);

  // ── Add checklist item ──
  const addItem = useCallback(async () => {
    if (!newItemTitle.trim()) return;
    try {
      const resp = await fetch("/api/evidence/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obligationId,
          title: newItemTitle.trim(),
          source: "user",
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setItems((prev) => [...prev, data.item]);
        setNewItemTitle("");
        setAddingItem(false);
      }
    } catch {
      // Silent fail
    }
  }, [obligationId, newItemTitle]);

  // ── Toggle checklist item ──
  const toggleItem = useCallback(async (itemId: string, isCompleted: boolean) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, is_completed: isCompleted, completed_at: isCompleted ? new Date().toISOString() : null }
          : i,
      ),
    );

    try {
      const resp = await fetch(`/api/evidence/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      if (!resp.ok) {
        // Revert
        setItems((prev) =>
          prev.map((i) =>
            i.id === itemId ? { ...i, is_completed: !isCompleted, completed_at: null } : i,
          ),
        );
      }
    } catch {
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, is_completed: !isCompleted, completed_at: null } : i,
        ),
      );
    }
  }, []);

  // ── Delete checklist item ──
  const deleteItem = useCallback(async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await fetch(`/api/evidence/items/${itemId}`, { method: "DELETE" });
    } catch {
      fetchData(); // Revert by refetching
    }
  }, [fetchData]);

  // ── Add link attachment ──
  const addLink = useCallback(async () => {
    if (!linkName.trim() || !linkUrl.trim()) return;
    try {
      const resp = await fetch("/api/evidence/attachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obligationId,
          fileName: linkName.trim(),
          externalUrl: linkUrl.trim(),
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setAttachments((prev) => [...prev, data.attachment]);
        setLinkName("");
        setLinkUrl("");
        setAddingLink(false);
      }
    } catch {
      // Silent fail
    }
  }, [obligationId, linkName, linkUrl]);

  // ── Upload file ──
  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("obligationId", obligationId);
        formData.append("systemId", systemId);

        const resp = await fetch("/api/evidence/upload", {
          method: "POST",
          body: formData,
        });
        if (resp.ok) {
          const data = await resp.json();
          setAttachments((prev) => [...prev, data.attachment]);
        }
      } catch {
        // Silent fail
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [obligationId, systemId],
  );

  // ── Delete attachment ──
  const deleteAttachment = useCallback(async (attachId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachId));
    try {
      await fetch(`/api/evidence/attachments/${attachId}`, { method: "DELETE" });
    } catch {
      fetchData();
    }
  }, [fetchData]);

  // ── Stats ──
  const completedItems = items.filter((i) => i.is_completed).length;
  const totalItems = items.length;
  const hasEvidence = totalItems > 0 || attachments.length > 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-3 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Evidence
          </p>
          {totalItems > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {completedItems}/{totalItems} items
            </span>
          )}
          {attachments.length > 0 && (
            <span className="text-[10px] text-muted-foreground">
              · {attachments.length} file{attachments.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {/* Progress indicator */}
        {totalItems > 0 && (
          <EvidenceProgress completed={completedItems} total={totalItems} />
        )}
      </div>

      {/* ── Checklist items ── */}
      {items.length > 0 && (
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 group"
            >
              <button
                onClick={() => toggleItem(item.id, !item.is_completed)}
                className={`mt-0.5 w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                  item.is_completed
                    ? "bg-green-500/20 border-green-500/40"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                {item.is_completed && (
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                className={`text-xs flex-1 ${
                  item.is_completed ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {item.title}
                {item.source === "ai_suggested" && (
                  <span className="ml-1 text-[9px] text-primary/60 uppercase">AI</span>
                )}
              </span>
              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity"
                title="Remove item"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Add item form ── */}
      {addingItem ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Evidence item description..."
            className="flex-1 px-2 py-1.5 text-xs bg-background border border-border text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <Button size="sm" onClick={addItem} disabled={!newItemTitle.trim()}>
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAddingItem(false);
              setNewItemTitle("");
            }}
          >
            Cancel
          </Button>
        </div>
      ) : null}

      {/* ── Attachments ── */}
      {attachments.length > 0 && (
        <>
          <Separator />
          <div className="space-y-1.5">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Attached Files & Links
            </p>
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 group text-xs"
              >
                {/* Icon */}
                <span className="text-muted-foreground shrink-0">
                  {att.attachment_type === "file" ? (
                    <FileIcon type={att.file_type} />
                  ) : (
                    <LinkIcon />
                  )}
                </span>
                {/* Name (clickable if link) */}
                {att.attachment_type === "link" && att.external_url ? (
                  <a
                    href={att.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate flex-1"
                  >
                    {att.file_name}
                  </a>
                ) : (
                  <span className="text-foreground truncate flex-1">{att.file_name}</span>
                )}
                {/* Size */}
                {att.file_size && (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatFileSize(att.file_size)}
                  </span>
                )}
                {/* Delete */}
                <button
                  onClick={() => deleteAttachment(att.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity shrink-0"
                  title="Remove attachment"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Add link form ── */}
      {addingLink && (
        <div className="space-y-2 p-2 border border-border bg-card">
          <input
            type="text"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            placeholder="Link name (e.g. Risk Assessment Policy)"
            className="w-full px-2 py-1.5 text-xs bg-background border border-border text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLink()}
            placeholder="https://..."
            className="w-full px-2 py-1.5 text-xs bg-background border border-border text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addLink} disabled={!linkName.trim() || !linkUrl.trim()}>
              Add Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAddingLink(false);
                setLinkName("");
                setLinkUrl("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex gap-2 flex-wrap">
        {!addingItem && (
          <button
            onClick={() => setAddingItem(true)}
            className="text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
          >
            + Add checklist item
          </button>
        )}
        {!addingLink && (
          <button
            onClick={() => setAddingLink(true)}
            className="text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
          >
            + Add link
          </button>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "+ Upload file"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg,.txt,.csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
      </div>

      {/* ── Empty state ── */}
      {!hasEvidence && !addingItem && !addingLink && (
        <p className="text-[10px] text-muted-foreground italic">
          No evidence yet. Add checklist items, links, or upload files to document compliance.
        </p>
      )}
    </div>
  );
}

// ━━━ SUB-COMPONENTS ━━━

function EvidenceProgress({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 bg-muted overflow-hidden">
        <div
          className={`h-full transition-all ${
            pct === 100 ? "bg-green-500" : "bg-primary"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{pct}%</span>
    </div>
  );
}

function FileIcon({ type }: { type: string | null }) {
  const ext = type?.includes("pdf") ? "PDF" : type?.includes("word") ? "DOC" : type?.includes("sheet") ? "XLS" : type?.includes("image") ? "IMG" : "FILE";
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-[8px] font-bold border border-border bg-card">
      {ext}
    </span>
  );
}

function LinkIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
