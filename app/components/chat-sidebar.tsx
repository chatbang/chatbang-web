import { useEffect, useRef } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showToast } from "./ui-lib";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        const n = chatStore.sessions.length;
        const limit = (x: number) => (x + n) % n;
        const i = chatStore.currentSessionIndex;
        if (e.key === "ArrowUp") {
          chatStore.selectSession(limit(i - 1));
        } else if (e.key === "ArrowDown") {
          chatStore.selectSession(limit(i + 1));
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

export function ChatSideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  const navigate = useNavigate();
  const config = useAppConfig();

  // const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);
  // const isMobileScreen = useMobileScreen();
  // const shouldNarrow =
  //     !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;
  // useEffect(() => {
  //   const barWidth = shouldNarrow
  //       ? NARROW_SIDEBAR_WIDTH
  //       : limit(config.sidebarWidth ?? 300);
  //   const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
  //   document.documentElement.style.setProperty("--chat-sidebar-width", sideBarWidth);
  // }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  useHotKey();

  return (
    <div className={`${styles["chat-sidebar"]} ${props.className}`}>
      <div className={styles["sidebar-header-bar"]}>
        {/*<IconButton*/}
        {/*    icon={<PluginIcon/>}*/}
        {/*    text={shouldNarrow ? undefined : Locale.Store.UploadData}*/}
        {/*    className={styles["sidebar-bar-button"]}*/}
        {/*    onClick={() => showToast(Locale.WIP)}*/}
        {/*    shadow*/}
        {/*/>*/}
        <p className={styles["sidebar-sub-title"]}>最近的聊天</p>
      </div>

      <div className={styles["sidebar-body"]}>
        <ChatList />
      </div>

      <div className={styles["chat-sidebar-tail"]}>
        <IconButton
          className={styles["new-chat-button"]}
          icon={<AddIcon />}
          text={Locale.Home.NewChat}
          onClick={() => {
            if (config.dontShowMaskSplashScreen) {
              chatStore.newSession();
              navigate(Path.Chat);
            } else {
              navigate(Path.NewChat);
            }
          }}
          shadow
        />
      </div>
    </div>
  );
}
