import { $host } from "./index";

export const getChats = async () => {
  try {
    return $host
      ?.get("https://buyer-chat-api.wildberries.ru/api/v1/seller/chats")
      ?.catch((e) => {
        return e;
      });
  } catch (e) {
    return e;
  }
};

export const getMessages = async () => {
  try {
    return $host
      ?.get("https://buyer-chat-api.wildberries.ru/api/v1/seller/events")
      ?.catch((e) => {
        return e;
      });
  } catch (e) {
    return e;
  }
};

export const sendMessage = async (id, text) => {
  try {
    return $host
      ?.post("https://buyer-chat-api.wildberries.ru/api/v1/seller/message", {
        id,
        text,
      })
      ?.catch((e) => {
        return e;
      });
  } catch (e) {
    return e;
  }
};
