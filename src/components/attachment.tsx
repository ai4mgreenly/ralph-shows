import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import snarkdown from "snarkdown";
import { fetchAttachment, type AttachmentDetail } from "../api.ts";
import { navigateHome } from "../state.ts";

const attachment = signal<AttachmentDetail | null>(null);
const loading = signal(true);

export function AttachmentView({ goalId, attachmentId }: { goalId: number; attachmentId: number }) {
  useEffect(() => {
    loading.value = true;
    attachment.value = null;
    fetchAttachment(goalId, attachmentId).then((att) => {
      attachment.value = att;
      loading.value = false;
    });
  }, [goalId, attachmentId]);

  if (loading.value) {
    return <p class="empty">Loading...</p>;
  }

  const att = attachment.value;
  if (!att) {
    return <p class="empty">Attachment not found</p>;
  }

  return (
    <div class="goal-detail">
      <a href="#" class="back-link" onClick={(e) => { e.preventDefault(); history.back(); }}>
        back
      </a>
      <h2 class="detail-title">{att.name}</h2>
      <div class="detail-meta">
        <span>goal #{att.goal_id}</span>
      </div>
      <div class="detail-timestamps">
        <span>created {att.created_at}</span>
        <span>updated {att.updated_at}</span>
      </div>
      <div
        class="attachment-body"
        style="margin-top: 1em; line-height: 1.6;"
        dangerouslySetInnerHTML={{ __html: snarkdown(att.body) }}
      />
    </div>
  );
}
