from __future__ import annotations

from collections import defaultdict
from collections.abc import Callable
from typing import Annotated, Optional

import structlog
import typer

from scraper import manifest
from scraper.context import ScraperContext
from scraper.corpus import (
    ensure_corpus_writable,
    manifest_path,
    mkdirs_all,
    resolve_corpus_root,
)
from scraper.logging_setup import configure_logging
from scraper.settings import AppSettings, load_config_yaml
from scraper.sources import company_careers, glassdoor, q_banks, reddit, youtube

app = typer.Typer(no_args_is_help=True, add_completion=False)

SCRAPERS: dict[str, Callable[..., None]] = {
    "youtube": youtube.run,
    "glassdoor": glassdoor.run,
    "company_careers": company_careers.run,
    "q_banks": q_banks.run,
    "reddit": reddit.run,
}

SOURCE_ORDER = ("youtube", "glassdoor", "company_careers", "q_banks", "reddit")


def _open_context(limit: int | None) -> ScraperContext:
    settings = AppSettings()
    root = resolve_corpus_root(settings)
    ensure_corpus_writable(root)
    mkdirs_all(root)
    configure_logging(root / "logs" / "scraper", settings.log_level)
    log = structlog.get_logger("scraper.cli")
    mpath = manifest_path(root)
    conn = manifest.connect(mpath)
    manifest.init_schema(conn)
    ycfg = load_config_yaml()
    return ScraperContext(
        corpus_root=root,
        manifest_path=mpath,
        manifest_conn=conn,
        settings=settings,
        yaml_config=ycfg,
        limit=limit,
        log=log,
    )


@app.command()
def init() -> None:
    """Verify corpus root, create dirs, initialize manifest.sqlite."""
    settings = AppSettings()
    root = resolve_corpus_root(settings)
    ensure_corpus_writable(root)
    mkdirs_all(root)
    configure_logging(root / "logs" / "scraper", settings.log_level)
    log = structlog.get_logger("scraper.cli")
    mpath = manifest_path(root)
    conn = manifest.connect(mpath)
    manifest.init_schema(conn)
    conn.close()
    log.info("init_complete", corpus_root=str(root), manifest=str(mpath))


@app.command("scrape")
def scrape_cmd(
    source: Annotated[str, typer.Argument(help="youtube|glassdoor|company_careers|q_banks|reddit")],
    limit: Annotated[Optional[int], typer.Option("--limit", help="Max items for smoke tests")] = None,
) -> None:
    if source not in SCRAPERS:
        raise typer.BadParameter(f"Unknown source {source!r}. Choose one of: {', '.join(SCRAPERS)}")
    ctx = _open_context(limit)
    try:
        SCRAPERS[source](ctx, None)
    finally:
        ctx.manifest_conn.close()


@app.command("scrape-all")
def scrape_all(
    limit: Annotated[Optional[int], typer.Option("--limit", help="Per-source item cap")] = None,
) -> None:
    ctx = _open_context(limit)
    try:
        for name in SOURCE_ORDER:
            ctx.log.info("scrape_all_step", source=name)
            SCRAPERS[name](ctx, None)
    finally:
        ctx.manifest_conn.close()


@app.command()
def status() -> None:
    ctx = _open_context(None)
    try:
        rows = manifest.status_counts(ctx.manifest_conn)
        if not rows:
            typer.echo("No manifest rows yet.")
            return
        for r in rows:
            typer.echo(f"{r['source']}\t{r['status']}\t{r['n']}")
    finally:
        ctx.manifest_conn.close()


@app.command()
def resume(
    limit: Annotated[Optional[int], typer.Option("--limit", help="Max resume rows")] = None,
) -> None:
    ctx = _open_context(None)
    try:
        rows = manifest.rows_to_resume(ctx.manifest_conn, limit)
        if not rows:
            ctx.log.info("resume_nothing")
            return
        by_src: dict[str, list[str]] = defaultdict(list)
        for row in rows:
            by_src[row["source"]].append(row["url"])
        for src, urls in by_src.items():
            if src not in SCRAPERS:
                ctx.log.warning("resume_unknown_source", source=src)
                continue
            SCRAPERS[src](ctx, resume_urls=urls)
    finally:
        ctx.manifest_conn.close()


def main() -> None:
    app()


if __name__ == "__main__":
    main()
