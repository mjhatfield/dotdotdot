import { createHash } from "crypto";
import * as vscode from "vscode";
import { ManagedSettingState, ManagedStateStore } from "./stateStore";

const THINKING_SETTING_KEY = "chat.agent.thinking.phrases";
const TARGET = vscode.ConfigurationTarget.Global;

function hashValue(value: unknown): string {
  const text = value === undefined ? "__undefined__" : JSON.stringify(value);
  return createHash("sha256").update(text).digest("hex");
}

function payloadForPhrases(phrases: string[]): { mode: "replace"; phrases: string[] } {
  return {
    mode: "replace",
    phrases,
  };
}

export class ThinkingPhrasesApplier {
  private readonly stateStore: ManagedStateStore;

  public constructor(context: vscode.ExtensionContext) {
    this.stateStore = new ManagedStateStore(context);
  }

  private getCurrentValueAtTarget(target: vscode.ConfigurationTarget): unknown {
    const inspected = vscode.workspace.getConfiguration().inspect<unknown>(THINKING_SETTING_KEY);
    if (!inspected) {
      return undefined;
    }

    if (target === vscode.ConfigurationTarget.Workspace) {
      return inspected.workspaceValue;
    }

    return inspected.globalValue;
  }

  public async apply(phrases: string[]): Promise<{ hadConflict: boolean; phraseCount: number }> {
    const currentValue = this.getCurrentValueAtTarget(TARGET);
    const existingState = this.stateStore.read();

    const payload = payloadForPhrases(phrases);
    const nextHash = hashValue(payload);

    let hadConflict = false;
    let nextState: ManagedSettingState;

    if (existingState) {
      const currentHash = hashValue(currentValue);
      hadConflict = currentHash !== existingState.lastAppliedHash;
      nextState = {
        ...existingState,
        lastAppliedHash: nextHash,
      };
    } else {
      nextState = {
        backup: {
          hadValue: currentValue !== undefined,
          value: currentValue,
        },
        lastAppliedHash: nextHash,
      };
    }

    await vscode.workspace.getConfiguration().update(THINKING_SETTING_KEY, payload, TARGET);
    await this.stateStore.write(nextState);

    return {
      hadConflict,
      phraseCount: phrases.length,
    };
  }

  public async restore(): Promise<boolean> {
    const state = this.stateStore.read();
    if (!state) {
      return false;
    }

    const valueToRestore = state.backup.hadValue ? state.backup.value : undefined;

    await vscode.workspace.getConfiguration().update(THINKING_SETTING_KEY, valueToRestore, TARGET);
    await this.stateStore.clear();

    return true;
  }
}
