import { ScaffoldBanner } from "@/components/admin/ScaffoldBanner";

export default function AdminAuditLogPage() {
  return (
    <div className="space-y-4">
      <ScaffoldBanner feature="Audit log UI" />
      <h1 className="text-2xl font-semibold">Audit log</h1>
      <p className="text-sm text-muted-foreground">
        Admin mutations write AuditLog rows.
      </p>
    </div>
  );
}
