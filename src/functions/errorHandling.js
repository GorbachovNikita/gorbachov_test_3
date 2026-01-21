export const errorHandling = (response, setErrors, setDisplay) => {
  let errors = [];

  if (response?.status === 401) {
    if (
      response?.response?.data?.detail ===
      "read-only token scope not allowed for this route"
    ) {
      errors.push("У Вас не достаточно прав на это действие");
    } else {
      errors.push("Пользователь не авторизован");
    }
  } else if (response?.status === 403) {
    errors.push("Пользователь не авторизован");
  } else if (response?.status === 429) {
    errors.push("Слишком больше количество запросов");
  } else {
    errors.push("При запросе произошла ошибка");
  }

  setErrors(errors);
  setDisplay("flex");
};
