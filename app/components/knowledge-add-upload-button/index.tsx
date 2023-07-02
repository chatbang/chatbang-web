// 新增预设对话按钮
import React, { FC, useState } from "react";
import AddIcon from "../../icons/add.svg";
import { IconButton } from "../button";
import Locale from "../../locales";
import styles from "./index.module.scss";
import { Modal, message, Upload, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
// import type { UploadProps } from 'antd';

const { Dragger } = Upload;

interface ExploreAddUploadButtonProps {
  // todo
  // onCreate:
}

// TODO：上传流程
const ExploreAddUploadButton: FC<ExploreAddUploadButtonProps> = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        className={styles["knowledge-create"]}
        icon={<AddIcon />}
        onClick={() => {
          setVisible(true);
        }}
      >
        {Locale.Mask.Page.Create}
      </Button>
      <Modal
        open={visible}
        title={Locale.Mask.EditModal.Title(false)}
        onCancel={() => setVisible(false)}
      >
        <Dragger>
          <p className="ant-upload-drag-icon">
            <InboxOutlined rev={undefined} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件至此区域即可上传</p>
        </Dragger>
      </Modal>
    </>
  );
};

export default ExploreAddUploadButton;
