from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.data.legacy_domains import LEGACY_DOMAINS
from app.services.domains import business_communication

router = APIRouter(prefix="/domains", tags=["domains"])

_DOMAIN_MODULES = {
    "business_communication": business_communication,
}


class DomainPromptRequest(BaseModel):
    module: str
    subdomain: str
    user_input: str = Field(min_length=1)
    goal: str | None = None
    memory: str | None = None
    traits: str | None = None


@router.get("")
async def list_domains() -> dict:
    return {
        "domains": LEGACY_DOMAINS,
        "status": "archive",
        "liveModules": list(_DOMAIN_MODULES.keys()),
        "note": "Interview personas are live on the web app; domain prompts are preview-only.",
    }


@router.post("/prompt")
async def domain_prompt(body: DomainPromptRequest) -> dict:
    mod = _DOMAIN_MODULES.get(body.module)
    if mod is None:
        raise HTTPException(
            status_code=404,
            detail=f"Module {body.module} not ported yet",
        )
    subdomains = mod.get_subdomains()
    if body.subdomain not in subdomains:
        raise HTTPException(
            status_code=400,
            detail=f"subdomain must be one of: {', '.join(subdomains)}",
        )
    return mod.generate_prompt(
        user_input=body.user_input,
        subdomain=body.subdomain,
        goal=body.goal,
        memory=body.memory,
        traits=body.traits,
    )
