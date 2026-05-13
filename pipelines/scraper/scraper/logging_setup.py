from __future__ import annotations

import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

import structlog


class UtcDailyRotatingFileHandler(logging.Handler):
    """Write to logs/scraper/YYYY-MM-DD.log; roll over at UTC midnight."""

    def __init__(self, log_dir: Path):
        super().__init__()
        self.log_dir = Path(log_dir)
        self._day: str | None = None
        self._stream = None

    def emit(self, record: logging.LogRecord) -> None:
        try:
            day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            if day != self._day:
                if self._stream:
                    self._stream.close()
                    self._stream = None
                self._day = day
                self.log_dir.mkdir(parents=True, exist_ok=True)
                self._stream = open(self.log_dir / f"{day}.log", "a", encoding="utf-8")
            msg = self.format(record)
            self._stream.write(msg + "\n")
            self._stream.flush()
        except Exception:
            self.handleError(record)

    def close(self) -> None:
        if self._stream:
            self._stream.close()
            self._stream = None
        super().close()


def configure_logging(log_dir: Path, level: str = "INFO") -> None:
    log_dir.mkdir(parents=True, exist_ok=True)
    lvl = getattr(logging, level.upper(), logging.INFO)

    timestamper = structlog.processors.TimeStamper(fmt="iso", utc=True)
    pre_chain = [
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        timestamper,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    structlog.configure(
        processors=pre_chain + [structlog.stdlib.ProcessorFormatter.wrap_for_formatter],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=pre_chain,
        processor=structlog.processors.JSONRenderer(),
    )

    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(lvl)

    file_handler = UtcDailyRotatingFileHandler(log_dir)
    file_handler.setLevel(lvl)
    file_handler.setFormatter(formatter)

    console = logging.StreamHandler(sys.stderr)
    console.setLevel(lvl)
    console.setFormatter(formatter)

    root.addHandler(file_handler)
    root.addHandler(console)
