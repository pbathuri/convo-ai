# Training readiness thresholds

| Labeled data | Action |
|--------------|--------|
| 50 SME-graded answers | Rubric calibration only |
| 500 sessions | Prompt/rubric optimization |
| 5,000 labeled | Weakness classifiers |
| 20,000+ | Fine-tuned evaluator (privacy review required) |

Rollback: revert `KbVersion` + rubric version pins per session.
