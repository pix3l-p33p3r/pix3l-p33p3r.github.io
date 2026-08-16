#!/usr/bin/env bash
# Enable branch protection + ruleset on main.
# Run as the repo owner (pix3l-p33p3r) with GitHub CLI authenticated:
#   gh auth login
#   ./scripts/enable-branch-protection.sh
set -euo pipefail

OWNER="${OWNER:-pix3l-p33p3r}"
REPO="${REPO:-pix3l-p33p3r.github.io}"
BRANCH="${BRANCH:-main}"

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
echo "Protecting ${OWNER}/${REPO}@${BRANCH} ..."

# Classic branch protection (works on all repo plans)
if ! gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${OWNER}/${REPO}/branches/${BRANCH}/protection" \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build", "branch-naming"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "required_linear_history": true,
  "allow_fork_syncing": false
}
EOF
then
  echo >&2
  echo "error: could not set branch protection (need repo admin as ${OWNER})." >&2
  echo "If you are the owner, run: gh auth login   # login as ${OWNER}, not an app token" >&2
  echo "UI fallback: https://github.com/${OWNER}/${REPO}/settings/branches" >&2
  exit 1
fi

echo
echo "Classic branch protection applied on '${BRANCH}'."

# Also create/update a ruleset when the account supports it (idempotent by name)
EXISTING_ID="$(gh api "/repos/${OWNER}/${REPO}/rulesets" --jq '.[] | select(.name=="Protect main") | .id' 2>/dev/null || true)"

RULESET_BODY='{
  "name": "Protect main",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "bypass_actors": [],
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "build" },
          { "context": "branch-naming" }
        ]
      }
    }
  ]
}'

if [[ -n "${EXISTING_ID}" ]]; then
  echo "Updating existing ruleset id=${EXISTING_ID} ..."
  echo "${RULESET_BODY}" | gh api --method PUT \
    -H "Accept: application/vnd.github+json" \
    "/repos/${OWNER}/${REPO}/rulesets/${EXISTING_ID}" \
    --input -
else
  echo "Creating ruleset 'Protect main' ..."
  echo "${RULESET_BODY}" | gh api --method POST \
    -H "Accept: application/vnd.github+json" \
    "/repos/${OWNER}/${REPO}/rulesets" \
    --input - || echo "note: ruleset create skipped (plan/permission); classic protection is enough."
fi

# GitHub Settings UI can clone classic protection into extra rulesets (main-1, main-2).
# Keep only "Protect main".
while IFS=$'\t' read -r extra_id extra_name; do
  [[ -z "${extra_id}" ]] && continue
  echo "Deleting extra ruleset '${extra_name}' (id=${extra_id}) ..."
  gh api --method DELETE \
    -H "Accept: application/vnd.github+json" \
    "/repos/${OWNER}/${REPO}/rulesets/${extra_id}"
done < <(gh api "/repos/${OWNER}/${REPO}/rulesets" --jq '.[] | select(.name != "Protect main") | "\(.id)\t\(.name)"')

# Prefer squash merges for this trunk-based flow
gh api --method PATCH "/repos/${OWNER}/${REPO}" \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=false \
  -f delete_branch_on_merge=true \
  -f squash_merge_commit_title=PR_TITLE \
  -f squash_merge_commit_message=PR_BODY \
  >/dev/null

echo
echo "Repo merge settings: squash-only + auto-delete head branches."
echo
echo "Verify:"
echo "  https://github.com/${OWNER}/${REPO}/settings/branches"
echo "  gh api /repos/${OWNER}/${REPO}/branches/${BRANCH}/protection --jq .required_status_checks"
