import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import { getHeaders } from "../client/api";
import { BOT_HELLO } from "./chat";
import { ALL_MODELS } from "./config";

export interface AccessControlStore {
  accessCode: string;
  token: string;
  isAdmin: boolean; // 是否是管理员

  needCode: boolean;
  hideUserApiKey: boolean;
  openaiUrl: string;

  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  enabledAccessControl: () => boolean;
  isAuthorized: () => boolean; // 是否已经授权
  fetchAuth: () => void; // 请求授权信息
}

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      accessCode: "",
      isAdmin: false,
      needCode: true,
      hideUserApiKey: false,
      openaiUrl: "/api/openai/",

      // 是否启用了访问控制
      enabledAccessControl() {
        // get().fetchAuth();
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
      // 进行验证
      isAuthorized() {
        if (fetchState === 0) get().fetchAuth();
        // 有 token or 禁用 access control，即可验证通过
        console.log(
          "isAuthorized：",
          !!get().token || !get().enabledAccessControl(),
        );
        return !!get().token || !get().enabledAccessControl();
      },
      // 获取授权信息
      async fetchAuth() {
        fetchState = 1;
        await fetch("/api/auth", {
          method: "post",
          body: JSON.stringify({ code: get().accessCode }),
          headers: {
            ...getHeaders(),
          },
        })
          .then((res) => res.json())
          .then((res: { status: number; [k: string]: any }) => {
            console.log("----------->", res);
            const { isAdmin, status } = res;
            if (status === 200) {
              this.updateToken(get().accessCode);
              set(() => ({ isAdmin }));
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
