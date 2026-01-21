import React, { useEffect, useRef, useState } from "react";
import "./ChatsWithCustomers.css";
import {
  getChats,
  getMessages,
  sendMessage,
} from "../../http/chatsWithCustomers";
import ErrorsBlock from "../../components/ErrorsBlock";
import { errorHandling } from "../../functions/errorHandling";

const ChatsWithCustomers = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [errors, setErrors] = useState([]);
  const [errorsDisplay, setErrorsDisplay] = useState("none");
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const chatRef = useRef();

  const getChatsFunction = async () => {
    setErrors([]);
    setErrorsDisplay("none");
    setLoading(true);
    const response = await getChats();
    if (response?.status === 200) {
      const formattedChats = response?.data?.result?.map((chat) => ({
        id: chat?.chatID,
        customerName: chat?.["clientName"] || "Неизвестно",
        lastMessage: chat?.lastMessage?.text || "Нет сообщений",
        date: chat?.lastMessage?.addTimestamp
          ? new Date(chat?.lastMessage?.addTimestamp)?.toLocaleDateString(
              "ru-RU",
            )
          : "",
        unread: 0,
        messages: [],
      }));
      setChats(formattedChats);
      const response_messages = await getMessages();
      if (response_messages?.status === 200) {
        const messagesByChat = response_messages?.data?.result?.events?.reduce(
          (acc, message) => {
            const chatId = message?.chatID;
            if (!acc?.[chatId]) {
              acc[chatId] = [];
            }
            acc[chatId]?.push(message);
            return acc;
          },
          {},
        );

        const updatedChats = formattedChats
          ?.map((chat) => {
            if (messagesByChat?.[chat?.id]) {
              return {
                ...chat,
                messages: messagesByChat?.[chat?.id],
              };
            }
            return chat;
          })
          ?.sort((a, b) => {
            if (a?.messages?.length > 0 && b?.messages?.length === 0) {
              return -1;
            }
            if (b?.messages?.length > 0 && a?.messages?.length === 0) {
              return 1;
            }
            return 0;
          });

        setChats(updatedChats);
      }
    } else {
      errorHandling(response, setErrors, setErrorsDisplay);
    }
    setLoading(false);
  };

  const sendMessageFunction = async (chatId, text) => {
    if (!text?.trim()) return;
    setErrors([]);
    setErrorsDisplay("none");
    setMessageLoading(true);
    const response = await sendMessage(chatId, text);
    if (response?.status === 200) {
      let messagePayload = {
        chatID: chatId,
        eventType: "message",
        message: {
          text: text,
        },
        source: "seller-portal",
        addTimestamp: Date?.now(),
        addTime: new Date()?.toISOString(),
        sender: "seller",
      };
      setChats((prevChats) =>
        prevChats?.map((chat) => {
          if (chat?.id === chatId) {
            return {
              ...chat,
              messages: [...chat?.messages, messagePayload],
              lastMessage: text,
              date: new Date()?.toISOString(),
            };
          }
          return chat;
        }),
      );
      setMessageText("");
    } else {
      errorHandling(response, setErrors, setErrorsDisplay);
    }
    setMessageLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflowY = "hidden";
    window.scrollTo(0, 0);
    getChatsFunction()?.then(() => {});
  }, []);

  useEffect(() => {
    if (selectedChat) {
      if (chatRef?.current) {
        chatRef?.current?.scrollTo(0, chatRef?.current?.scrollHeight);
      }
    }
  }, [selectedChat]);

  return (
    <div className="chats-container">
      <div className="chats-errors">
        <ErrorsBlock
          errors={errors}
          display={errorsDisplay}
          setDisplay={setErrorsDisplay}
        />
      </div>

      <div className="chats-header">
        <div className="chats-title">
          <h2>Чаты с покупателями</h2>
        </div>
      </div>

      <div className="chats-layout">
        <div className="chats-list">
          {loading ? (
            <div className="chats-list-loading">
              <p>Загрузка...</p>
            </div>
          ) : (
            chats?.map((chat) => (
              <div
                key={chat?.id}
                className={`chat-item ${selectedChat === chat?.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedChat(chat?.id);
                  setMessageText("");
                  setErrors([]);
                  setErrorsDisplay("none");
                }}
              >
                <div className="chat-info">
                  <strong>{chat?.customerName}</strong>
                  <p>{chat?.lastMessage}</p>
                </div>
                <div className="chat-meta">
                  <span className="chat-date">{chat?.date}</span>
                  {chat?.unread > 0 && (
                    <span className="unread-count">{chat?.unread}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="messages" ref={chatRef}>
                {chats
                  ?.find((chat) => chat?.id === selectedChat)
                  ?.messages.map((msg) => (
                    <div
                      key={msg?.["eventID"]}
                      className={`message ${msg?.sender === "client" ? "me" : "customer"}`}
                    >
                      <p>{msg?.message.text || "Нет текста"}</p>
                      <span className="message-time">
                        {new Date(msg?.addTimestamp)?.toLocaleString("ru-RU")}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="input-area input-area-customers">
                <textarea
                  placeholder="Напишите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e?.target?.value)}
                />
                <div className="send-message-button-block">
                  {!messageLoading ? (
                    <button
                      onClick={async () => {
                        await sendMessageFunction(selectedChat, messageText);
                      }}
                    >
                      Отправить
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <p className="no-selection">Выберите чат слева</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsWithCustomers;
