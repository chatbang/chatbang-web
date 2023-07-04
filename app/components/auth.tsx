import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import styles from "./auth.module.scss";
import { IconButton } from "./button";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";
import ChatLogoIcon from "../icons/chat-logo.svg";

export function AuthPage() {
  const navigate = useNavigate();
  const access = useAccessStore();
  const goHome = () => navigate(Path.Home);

  const [messageApi, contextHolder] = message.useMessage();

  const confirmHandler = useCallback(async () => {
    try {
      await access.fetchAuth();
      access.isAuthorized() && goHome();
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err.msg || err.message || err,
      });
    }
  }, [access]);

  const onInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && access.accessCode) {
      await confirmHandler();
    }
  };

  return (
    <div className={styles["auth-page"]}>
      {contextHolder}
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <ChatLogoIcon />
      </div>

      <div className={styles["auth-tips"]}>请输入认证码</div>

      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.Auth.Input}
        value={access.accessCode}
        onKeyDown={onInputKeyDown}
        onChange={(e) => {
          access.updateCode(e.currentTarget.value);
        }}
      />

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          disabled={!access.accessCode}
          onClick={confirmHandler}
        />
      </div>
    </div>
  );
}
