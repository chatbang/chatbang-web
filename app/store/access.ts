import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import { getHeaders } from "../client/api";
import { BOT_HELLO } from "./chat";
import { ALL_MODELS } from "./config";

export interface AccessControlStore {
  accessCode: string;
  token: string;
  hasAuthorized: boolean;

  needCode: boolean;
  hideUserApiKey: boolean;
  openaiUrl: string;

  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  enabledAccessControl: () => boolean;
  isAuthorized: () => boolean;
  fetch: () => void;
  refresh: () => void;
}

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      // 原设置中预设的密码
      // chatbang 中从api获取
      token: "123456",
      accessCode: "",
      needCode: true,
      hideUserApiKey: false,
      hasAuthorized: false,
      openaiUrl: "/api/openai/",

      // 更新验证状态
      refresh() {
        if (get().hasAuthorized) {
          get().isAuthorized();
        }
      },

      enabledAccessControl() {
        get().fetch();
        return get().needCode;
      },
      // 用户输入密码
      updateCode(code: string) {
        set(() => ({ accessCode: code }));
      },
      // 原设置中预设密码
      updateToken(token: string) {
        set(() => ({ token }));
      },
      // 获取授权信息
      getAuthInfo() {
        return get().hasAuthorized;
      },
      // 进行验证
      isAuthorized() {
        get().fetch();
        // has token or has code or disabled access control
        return (
          !!get().token || !!get().accessCode || !get().enabledAccessControl()
        );
      },
      // 获取授权信息
      fetch() {
        if (fetchState > 0) return;
        fetchState = 1;
        fetch("/api/auth", {
          method: "post",
          body: JSON.stringify({ code: get().accessCode }),
          headers: {
            "Content-Type": "application/json",
            "x-requested-with": "XMLHttpRequest",
            "Authorization-token": get().token,
          },
        })
          .then((res) => res.json())
          .then((res: { status: string; [k: string]: any }) => {
            console.log("[Auth] got Auth State from server", res);
            if (res.status === "1") {
              console.log("------");

              set(() => ({ hasAuthorized: true }));
            }
            // set(() => ({ ...res }));

            // if (!res.enableGPT4) {
            //   ALL_MODELS.forEach((model) => {
            //     if (model.name.startsWith("gpt-4")) {
            //       (model as any).available = false;
            //     }
            //   });
            // }
            // if ((res as any).botHello) {
            //   BOT_HELLO.content = (res as any).botHello;
            // }
          })
          .catch(() => {
            console.error("[Config] failed to fetch config");
          })
          .finally(() => {
            fetchState = 2;
          });
      },
    }),
    {
      name: StoreKey.Access,
      version: 1,
    },
  ),
);
