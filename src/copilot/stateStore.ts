import * as vscode from "vscode";

const STORE_KEY = "dotdotdot.managedThinkingPhrasesState";

interface BackupValue {
  hadValue: boolean;
  value?: unknown;
}

export interface ManagedSettingState {
  backup: BackupValue;
  lastAppliedHash: string;
}

export class ManagedStateStore {
  public constructor(private readonly context: vscode.ExtensionContext) {}

  public read(): ManagedSettingState | undefined {
    return this.context.globalState.get<ManagedSettingState>(STORE_KEY);
  }

  public async write(state: ManagedSettingState): Promise<void> {
    await this.context.globalState.update(STORE_KEY, state);
  }

  public async clear(): Promise<void> {
    await this.context.globalState.update(STORE_KEY, undefined);
  }
}
