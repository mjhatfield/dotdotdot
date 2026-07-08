# Local Install And Packaging

This guide covers local setup for development and creating a local VSIX package.

## Prerequisites

- Node.js and npm installed
- VS Code installed

## Install Dependencies

From the project root:

```bash
npm install
```

## Build The Extension

```bash
npm run compile
```

## Run Locally In VS Code

1. Open the project in VS Code.
2. Press F5 to launch an Extension Development Host window.
3. Open Settings and configure dotdotdot.enabled plus the dotdotdot.phrasePack.* checkboxes.

## Package As VSIX

Install the packaging tool once (global):

```bash
npm install -g @vscode/vsce
```

Create a VSIX from the project root:

```bash
vsce package
```

This generates a file like:

- dotdotdot-0.0.1.vsix

## Install VSIX Locally

In VS Code:

1. Open Extensions view.
2. Select More Actions (three dots).
3. Choose Install from VSIX.
4. Pick the generated VSIX file.

Or via command line:

```bash
code --install-extension dotdotdot-0.0.1.vsix
```
