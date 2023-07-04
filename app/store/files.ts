import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UploadFile } from "antd";
import { StoreKey } from "../constant";

export interface FileControlStore {
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
}

export const useFileListStore = create<FileControlStore>()(
  persist(
    (set, get) => ({
      fileList: [],
      setFileList(files: UploadFile[]) {
        set(() => ({ fileList: files }));
      },
    }),
    {
      name: StoreKey.Files,
      version: 1,
    },
  ),
);
