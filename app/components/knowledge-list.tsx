import DeleteIcon from "../icons/delete.svg";
import BotIcon from "../icons/bot.svg";
// FIXME：把knowledge-list进行删减，它是从从home.module.scss中复制过来的
import styles from "./knowledge-list.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect } from "react";
import { showToast } from "./ui-lib";

export function KnowledgeItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: number;
  index: number;
  narrow?: boolean;
  mask: Mask;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles["chat-item"]} ${
            props.selected && styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
            props.count,
          )}`}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                <MaskAvatar mask={props.mask} />
              </div>
              <div className={styles["chat-item-narrow-count"]}>
                {props.count}
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
            </>
          )}

          <div
            className={styles["chat-item-delete"]}
            onClickCapture={props.onDelete}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function KnowledgeList(props: { narrow?: boolean }) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
    ],
  );

  const chatStore = useChatStore();
  const navigate = useNavigate();

  const newSession = [
    {
      id: 1111111111111,
      topic: "AI课程",
      memoryPrompt: "",
      messages: [],
      stat: {
        tokenCount: 0,
        wordCount: 0,
        charCount: 0,
      },
      lastUpdate: 1688305461136,
      lastSummarizeIndex: 0,
      mask: {
        id: 1145141919810,
        avatar: "gpt-bot",
        name: "AI课程",
        context: [],
        syncGlobalConfig: true,
        modelConfig: {
          model: "gpt-3.5-turbo",
          temperature: 0.5,
          max_tokens: 2000,
          presence_penalty: 0,
          sendMemory: true,
          historyMessageCount: 4,
          compressMessageLengthThreshold: 1000,
        },
        lang: "cn",
        builtin: false,
      },
    },
  ];

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {newSession.map((item, i) => (
              <KnowledgeItem
                title={item.topic}
                time={new Date(item.lastUpdate).toLocaleString()}
                count={item.messages.length}
                key={item.id}
                id={item.id}
                index={i}
                selected={i === selectedIndex}
                onClick={() => {
                  // navigate(Path.Chat);
                  // selectSession(i);
                }}
                onDelete={() => {
                  showToast("暂未开放");
                  // if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
                  //   chatStore.deleteSession(i);
                  // }
                }}
                narrow={props.narrow}
                mask={item.mask as any}
              />
            ))}
            {/*----------------------*/}
            {/*{sessions.map((item, i) => (*/}
            {/*  <KnowledgeItem*/}
            {/*    title={item.topic}*/}
            {/*    time={new Date(item.lastUpdate).toLocaleString()}*/}
            {/*    count={item.messages.length}*/}
            {/*    key={item.id}*/}
            {/*    id={item.id}*/}
            {/*    index={i}*/}
            {/*    selected={i === selectedIndex}*/}
            {/*    onClick={() => {*/}
            {/*      navigate(Path.Chat);*/}
            {/*      selectSession(i);*/}
            {/*    }}*/}
            {/*    onDelete={() => {*/}
            {/*      if (!props.narrow || confirm(Locale.Home.DeleteChat)) {*/}
            {/*        chatStore.deleteSession(i);*/}
            {/*      }*/}
            {/*    }}*/}
            {/*    narrow={props.narrow}*/}
            {/*    mask={item.mask}*/}
            {/*  />*/}
            {/*))}*/}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
