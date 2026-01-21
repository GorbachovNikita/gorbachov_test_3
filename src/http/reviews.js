import { $host } from "./index";

export const getReviews = async (page) => {
  try {
    return $host
      ?.get("https://feedbacks-api.wildberries.ru/api/v1/feedbacks", {
        params: {
          isAnswered: false,
          take: 10,
          skip: (page - 1) * 10,
        },
      })
      ?.catch((e) => {
        return e;
      });
  } catch (e) {
    return e;
  }
};

export const sendResponseToReview = async (id, text) => {
  try {
    return $host
      ?.post("https://feedbacks-api.wildberries.ru/api/v1/feedbacks/answer", {
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
