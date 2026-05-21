import type { AllowedUsage, ApprovalStatus, LicenseStatus, PiiStatus, RobotsStatus } from "@prisma/client";

export type KbImportGovernance = {
  sourceType: string;
  licenseStatus?: LicenseStatus;
  robotsStatus?: RobotsStatus;
  allowedUsage?: AllowedUsage;
  piiStatus?: PiiStatus;
  approvalStatus?: ApprovalStatus;
};

const BANNED_SOURCE_TYPES = new Set(["glassdoor_full_review", "linkedin_scrape"]);

export function validateKbImport(g: KbImportGovernance): { ok: boolean; reason?: string } {
  if (BANNED_SOURCE_TYPES.has(g.sourceType)) {
    return { ok: false, reason: `Banned source type: ${g.sourceType}` };
  }
  if (!g.licenseStatus) {
    return { ok: false, reason: "licenseStatus is required" };
  }
  if (g.allowedUsage === "banned") {
    return { ok: false, reason: "allowedUsage is banned" };
  }
  if (g.piiStatus === "contains_pii_blocked") {
    return { ok: false, reason: "PII blocked on chunk" };
  }
  return { ok: true };
}
