"""KB source policy enforcement (mirrors conversate/web/src/lib/kb/policy.ts)."""

BANNED = {"glassdoor_full_review", "linkedin_scrape"}


def is_allowed_source(source_type: str, license_status: str | None = None) -> tuple[bool, str]:
    if source_type in BANNED:
        return False, f"Banned source type: {source_type}"
    if not license_status:
        return False, "licenseStatus is required"
    return True, "ok"
