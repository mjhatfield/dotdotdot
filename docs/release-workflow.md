# Release Workflow

This project uses two GitHub Actions workflows to cut releases with a VSIX asset.

## Workflows

- prepare-release-branch.yml
  - Manually run this workflow and choose bump type: major, minor, or patch.
  - It calculates the next version from existing `v*` tags (or from `0.0.0` if none exist).
  - It creates and pushes a branch like `release/v0.0.2` with version files updated.
- release-on-merge.yml
  - Runs after merge to `main` (or manual dispatch).
  - Runs tests and build.
  - Packages the extension as a VSIX.
  - Creates and pushes tag `vX.Y.Z` if it does not already exist.
  - Creates a draft GitHub release with blank notes and attaches the VSIX asset.

## Quick Release Steps

1. In GitHub Actions, run `Prepare Release Branch`.
2. Select `major`, `minor`, or `patch`.
3. Open a PR from the generated `release/vX.Y.Z` branch into `main`.
4. Merge the PR.
5. Open the draft release created by `Release On Merge`.
6. Write release notes manually.
7. Publish the release.

## Notes

- Draft releases are intentional so notes can be edited before publishing.
- If a tag already exists for the package version, the release workflow skips creating another release.
