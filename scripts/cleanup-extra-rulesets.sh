#!/usr/bin/env bash
# Remove leftover GitHub rulesets (main-1, main-2, …) and keep "Protect main".
# Run as the repo owner (pix3l-p33p3r):
#   gh auth login
#   ./scripts/cleanup-extra-rulesets.sh
set -euo pipefail

OWNER="${OWNER:-pix3l-p33p3r}"
REPO="${REPO:-pix3l-p33p3r.github.io}"
KEEP_NAME="${KEEP_NAME:-Protect main}"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: GitHub CLI (gh) is required" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "error: not logged in. Run: gh auth login" >&2
  exit 1
fi

LOGIN="$(gh api user --jq .login)"
echo "Authenticated as: ${LOGIN}"
echo "Cleaning extra rulesets on ${OWNER}/${REPO} (keeping '${KEEP_NAME}') ..."

deleted=0
while IFS=$'\t' read -r extra_id extra_name; do
  [[ -z "${extra_id}" ]] && continue
  echo "Deleting extra ruleset '${extra_name}' (id=${extra_id}) ..."
  gh api --method DELETE \
    -H "Accept: application/vnd.github+json" \
    "/repos/${OWNER}/${REPO}/rulesets/${extra_id}"
  deleted=$((deleted + 1))
done < <(gh api "/repos/${OWNER}/${REPO}/rulesets" --jq --arg keep "${KEEP_NAME}" '.[] | select(.name != $keep) | "\(.id)\t\(.name)"')

echo
if [[ "${deleted}" -eq 0 ]]; then
  echo "No extra rulesets. Only '${KEEP_NAME}' remains."
else
  echo "Deleted ${deleted} extra ruleset(s)."
fi

echo "Remaining:"
gh api "/repos/${OWNER}/${REPO}/rulesets" --jq '.[] | {id, name, enforcement}'
echo
echo "Verify: https://github.com/${OWNER}/${REPO}/settings/branches"
