#!/bin/bash
#SBATCH --job-name=embed_kb
#SBATCH --time=02:00:00
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G

module load python/3.11
cd $SLURM_SUBMIT_DIR
python -m pipelines.kb.embed_batch --input data/kb_approved.jsonl
