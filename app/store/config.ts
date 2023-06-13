import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import type { StorageValue } from "zustand/middleware/persist";

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

export const DEFAULT_CONFIG = {
  submitKey: SubmitKey.Enter as SubmitKey, // 提交消息的默认按键
  avatar: "1f603", // 默认头像样式
  fontSize: 14,
  theme: Theme.Auto as Theme,
  sendPreviewBubble: true, // 发送消息时是否显示预览气泡
  sidebarWidth: 100,

  disablePromptHint: false, // 是否禁用提示信息

  dontShowMaskSplashScreen: false, // dont show splash screen when create chat

  modelConfig: {
    model: "gpt-3.5-turbo" as ModelType, // 模型名称
    temperature: 0.5, // 默认随机数
    max_tokens: 2000, // 最大生成长度
    presence_penalty: 0, // 话题新鲜数
    sendMemory: true,
    historyMessageCount: 4, // 历史消息数量
    compressMessageLengthThreshold: 1000, //消息长度大于此阈值时自动压缩
  },
};

export type ChatConfig = typeof DEFAULT_CONFIG;

export type ChatConfigStore = ChatConfig & {
  reset: () => void;
  update: (updater: (config: ChatConfig) => void) => void;
};

export type ModelConfig = ChatConfig["modelConfig"];

const ENABLE_GPT4 = true;

export const ALL_MODELS = [
  {
    name: "gpt-4",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-0314",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-32k",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-32k-0314",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "qwen-v1", // 通义千问
    available: false,
  },
  {
    name: "ernie", // 文心一言
    available: false,
  },
  {
    name: "spark", // 讯飞星火
    available: false,
  },
  {
    name: "llama", // llama
    available: false,
  },
  {
    name: "chatglm", // chatglm-6b
    available: false,
  },
] as const;

export type ModelType = (typeof ALL_MODELS)[number]["name"];

export function limitNumber(
  x: number,
  min: number,
  max: number,
  defaultValue: number,
) {
  if (typeof x !== "number" || isNaN(x)) {
    return defaultValue;
  }

  return Math.min(max, Math.max(min, x));
}

export function limitModel(name: string) {
  return ALL_MODELS.some((m) => m.name === name && m.available)
    ? name
    : ALL_MODELS[4].name;
}

export const ModalConfigValidator = {
  model(x: string) {
    return limitModel(x) as ModelType;
  },
  max_tokens(x: number) {
    return limitNumber(x, 0, 32000, 2000);
  },
  presence_penalty(x: number) {
    return limitNumber(x, -2, 2, 0);
  },
  temperature(x: number) {
    return limitNumber(x, 0, 1, 1);
  },
};

const serialize = (
  storageState: StorageValue<ChatConfigStore>,
): string | Promise<string> => {
  const { state, version } = storageState;
  const serializedState = { state, version };
  return JSON.stringify(serializedState);
};

const deserialize = (
  str: string,
): StorageValue<ChatConfigStore> | Promise<StorageValue<ChatConfigStore>> => {
  const { state, version } = JSON.parse(str);
  return { state, version };
};

export const useAppConfig = create<ChatConfigStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CONFIG,

      reset() {
        set(() => ({ ...DEFAULT_CONFIG }));
      },

      update(updater) {
        const config = { ...get() };
        updater(config);
        set(() => config);
      },
    }),
    {
      name: StoreKey.Config,
      version: 2,
      // serialize和deserialize添加的意义都是为了解决submitKey无法设置默认值的问题
      serialize, // Add the custom serialize function here
      deserialize, // Add the custom deserialize function here
      migrate(persistedState, version) {
        if (version === 2) return persistedState as any;

        const state = persistedState as ChatConfig;
        state.modelConfig.sendMemory = true;
        state.modelConfig.historyMessageCount = 4;
        state.modelConfig.compressMessageLengthThreshold = 1000;
        state.dontShowMaskSplashScreen = false;

        return state;
      },
    },
  ),
);
