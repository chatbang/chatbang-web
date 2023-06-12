import { useEffect, useState } from "react";
import styles from "./admin.module.scss";
import { AuthPage } from "./auth";
import { useAccessStore } from "../store";

export function AdminPage() {
  const access = useAccessStore();
  useEffect(() => {
    // 刷新页面检查auth状态
    access.refresh();
  }, []);

  return (
    <div className={styles["admin-page"]}>
      <div className={styles["admin-page-main"]}>
        <header className={styles["admin-page-header"]}>
          <h2>管理后台</h2>
        </header>
        <main>
          {!access.hasAuthorized ? (
            <>
              <AuthPage type="admin" />
            </>
          ) : (
            <div>管理页面</div>
          )}
        </main>
      </div>
    </div>
  );
}
