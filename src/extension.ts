import * as vscode from "vscode";
import { getDotSettings, updateDotSetting } from "./config/settings";
import { PhrasePackService } from "./phrasePacks/phrasePackService";
import { ensureSuffix } from "./messaging/phraseFormatter";
import { DOTDOTDOT_SUFFIX } from "./phrasePacks/registry";
import { ThinkingPhrasesApplier } from "./copilot/thinkingPhrasesApplier";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const phrasePackService = new PhrasePackService();
  const applier = new ThinkingPhrasesApplier(context);

  let lastKnownEnabled = getDotSettings().enabled;

  async function getPhrasesWithFallback(): Promise<string[]> {
    const settings = getDotSettings();
    const loadResult = await phrasePackService.load(settings);
    if (loadResult.activePhrases.length > 0) {
      return loadResult.activePhrases;
    }

    return [ensureSuffix("Loading", DOTDOTDOT_SUFFIX)];
  }

  async function applyNow(notify: boolean): Promise<void> {
    const phrases = await getPhrasesWithFallback();
    const result = await applier.apply(phrases);

    if (result.hadConflict) {
      vscode.window.showWarningMessage("dotdotdot reapplied phrase replacement after detecting external edits to chat.agent.thinking.phrases.");
    }

    if (notify) {
      vscode.window.showInformationMessage(`dotdotdot applied ${result.phraseCount} phrase(s) to chat.agent.thinking.phrases.`);
    }
  }

  async function restoreNow(notify: boolean): Promise<void> {
    const restored = await applier.restore();

    if (notify) {
      if (restored) {
        vscode.window.showInformationMessage("dotdotdot restored the previous chat.agent.thinking.phrases value.");
      } else {
        vscode.window.showInformationMessage("dotdotdot had no managed backup to restore.");
      }
    }
  }

  async function setEnabled(enabled: boolean): Promise<void> {
    await updateDotSetting("enabled", enabled);

    if (enabled) {
      await applyNow(false);
    } else {
      await restoreNow(false);
    }

    lastKnownEnabled = enabled;
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("dotdotdot.enable", async () => {
      await setEnabled(true);
    }),
    vscode.commands.registerCommand("dotdotdot.disable", async () => {
      await setEnabled(false);
    }),
    vscode.commands.registerCommand("dotdotdot.applyNow", async () => {
      await applyNow(true);
    }),
    vscode.commands.registerCommand("dotdotdot.restoreNow", async () => {
      await restoreNow(true);
    }),
    vscode.commands.registerCommand("dotdotdot.previewPhrases", async () => {
      const phrases = await getPhrasesWithFallback();
      const doc = await vscode.workspace.openTextDocument({
        language: "text",
        content: phrases.join("\n"),
      });
      await vscode.window.showTextDocument(doc, { preview: true });
    }),
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      if (!event.affectsConfiguration("dotdotdot")) {
        return;
      }

      const settings = getDotSettings();

      if (settings.enabled) {
        await applyNow(false);
      } else if (lastKnownEnabled) {
        await restoreNow(false);
      }

      lastKnownEnabled = settings.enabled;
    })
  );

  if (lastKnownEnabled) {
    await applyNow(false);
  }
}

export async function deactivate(): Promise<void> {
  return;
}
