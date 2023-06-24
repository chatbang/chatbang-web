import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import ChatLogoIcon from "../icons/chat-logo.svg";

export function AuthPage(props: {
  // 用户验证类型，普通用户 or 管理员
  type: "access" | "admin";
}) {
  const navigate = useNavigate();
  // 更新auth状态
  const access = useAccessStore();

  const authType = props.type;

  const goHome = () => navigate(Path.Home);

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <ChatLogoIcon />
      </div>

      <div className={styles["auth-tips"]}>请输入认证码</div>

      <input
        className={styles["auth-input"]}
        type="text"
        placeholder={Locale.Auth.Input}
        value={access.accessCode}
        onChange={(e) => {
          access.updateCode(e.currentTarget.value);
        }}
      />

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={access.isAuthorized}
        />
        <IconButton text={Locale.Auth.Later} onClick={goHome} />
      </div>
    </div>
  );
}
