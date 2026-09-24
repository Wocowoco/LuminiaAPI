---
name: bump-version
description: Bump the Luminia release version (major, minor or bugfix/patch). Updates version.json, commits and pushes the branch; the vX.Y.Z tag is created automatically once it's merged to main. Use when the user asks to bump/raise/release the version, or after they choose a bump when asked before opening a PR.
argument-hint: "[major|minor|patch]"
---

# Bump version

The released version lives in `LuminiaAPI/LuminiaWebsite/src/assets/version.json` (shown in the navbar). Every release gets a git tag `vX.Y.Z`, but **only after the bump is merged to main**: the `Tag release` GitHub Action (`.github/workflows/tag-release.yml`) creates it on the merge commit. Never create or push version tags from a branch.

## 1. Pick the level

If the argument is `major`, `minor` or `patch` (also accept `bugfix`/`fix` as `patch`), use it. Otherwise ask with AskUserQuestion, showing the concrete result for the current version (read it from `version.json`), e.g. for 2.1.0:

- **Major (3.0.0)**: big or breaking changes
- **Minor (2.2.0)**: new features
- **Bugfix (2.1.1)**: fixes only

## 2. Check the repo state

- The working tree must be clean apart from changes the user wants committed separately first. If there are uncommitted changes, stop and ask; don't fold them into the bump commit.
- Don't bump on `main`. If on `main`, ask the user whether to create a branch (`topic/<name>`) first.
- If the branch already has a bump commit (`version.json` differs from `origin/main`), ask before bumping again; usually they want to change the level, which means resetting the file to main's version first.

## 3. Bump and commit

```powershell
./scripts/bump-version.ps1 -Level <major|minor|patch>
```

The script prints the new version on its last line and fails if that tag already exists. Then:

```powershell
git add LuminiaAPI/LuminiaWebsite/src/assets/version.json
git commit -m "Bump version to <new>"   # plus the usual Co-Authored-By trailer
git push -u origin HEAD
```

If there's an open PR for the branch, the bump commit becomes part of it.

## 4. Report

Tell the user: old -> new version, the commit, and that the `v<new>` tag will be created automatically when the PR is merged to main. The navbar shows the new version after the next deploy (`./scripts/package.ps1` names the zip after it).

## Fallback: tag manually

Only if the user asks, or the action didn't run: on an up-to-date `main` where the bump is merged, find the merge commit that introduced it with `git log --first-parent -1 --format=%H origin/main -- LuminiaAPI/LuminiaWebsite/src/assets/version.json`, then `git tag v<version> <commit>` and `git push origin v<version>` after confirming with the user.
