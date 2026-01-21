import React, { useEffect, useState } from "react";
import "./ChatsWithSupport.css";
import { getQuestions, sendMessage } from "../../http/chatsWithSupport";
import { errorHandling } from "../../functions/errorHandling";
import ErrorsBlock from "../../components/ErrorsBlock";

const ChatsWithSupport = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [productInfoDisplay, setProductInfoDisplay] = useState("none");
  const [errors, setErrors] = useState([]);
  const [errorsDisplay, setErrorsDisplay] = useState("none");
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const getQuestionsFunction = async () => {
    setLoading(true);
    const response = await getQuestions();
    if (response?.status === 200) {
      setQuestions(response?.data?.data?.["questions"]);
    } else {
      errorHandling(response, setErrors, setErrorsDisplay);
    }
    setLoading(false);
  };

  const sendMessageFunction = async (questionId, text) => {
    if (!text?.trim()) return;
    setErrors([]);
    setErrorsDisplay("none");
    setMessageLoading(true);
    const response = await sendMessage(questionId, text);
    if (response?.status === 200) {
      setQuestions(
        (prev) =>
          Array?.isArray(prev) &&
          prev?.map((question) =>
            question?.id === questionId
              ? {
                  ...question,
                  answer: text,
                  state: "wbRu",
                }
              : question,
          ),
      );
      setAnswer("");
    } else {
      errorHandling(response, setErrors, setErrorsDisplay);
    }
    setMessageLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflowY = "hidden";
    getQuestionsFunction()?.then(() => {});
  }, []);

  const ru_question_state = {
    suppliersPortalSynch: "Открыто",
    wbRu: "Решено",
    none: "Отклонено",
  };

  return (
    <div className="support-chats-container">
      <div className="chats-errors">
        <ErrorsBlock
          errors={errors}
          display={errorsDisplay}
          setDisplay={setErrorsDisplay}
        />
      </div>

      <h2>Вопросы пользователей</h2>

      <div className="chats-layout">
        <div className="chats-list">
          {loading ? (
            <div className="chats-list-loading">
              <p>Загрузка...</p>
            </div>
          ) : (
            questions?.map((question) => (
              <div
                key={question.id}
                className={`chat-item ${selectedQuestion?.id === question?.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedQuestion(question);
                  setProductInfoDisplay("none");
                  setAnswer("");
                  setErrors([]);
                  setErrorsDisplay("none");
                }}
              >
                <div className="chat-info">
                  <strong>{question.text}</strong>
                  <p>
                    <strong>Товар:</strong>{" "}
                    {question?.["productDetails"]?.["productName"]}
                  </p>
                  <p>
                    <strong>Бренд:</strong>{" "}
                    {question?.["productDetails"]?.["brandName"]}
                  </p>
                </div>
                <div className="chat-meta">
                  <span className="chat-date">
                    {new Date(question?.["createdDate"])?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="chat-window">
          {selectedQuestion ? (
            <>
              <div className="chat-header">
                <div className="chat-header-left-content">
                  <h3>
                    Вопрос от{" "}
                    {new Date(
                      selectedQuestion?.["createdDate"],
                    )?.toLocaleDateString()}
                  </h3>
                  {selectedQuestion ? (
                    <div className="product-info support-product-info">
                      <p
                        onClick={() => {
                          setProductInfoDisplay("flex");
                        }}
                      >
                        Информация товаре
                      </p>
                    </div>
                  ) : null}
                </div>
                <span className="status-badge">
                  {ru_question_state?.[selectedQuestion?.state]}
                </span>
              </div>

              {selectedQuestion ? (
                <div
                  className="product-details"
                  style={{
                    display: productInfoDisplay,
                  }}
                >
                  <div>
                    <h4>Детали товара</h4>
                    <p>
                      <strong>Название:</strong>{" "}
                      {selectedQuestion?.["productDetails"]?.["productName"]}
                    </p>
                    <p>
                      <strong>Бренд:</strong>{" "}
                      {selectedQuestion?.["productDetails"]?.["brandName"]}
                    </p>
                    <p>
                      <strong>Артикул:</strong>{" "}
                      {
                        selectedQuestion?.["productDetails"]?.[
                          "supplierArticle"
                        ]
                      }
                    </p>
                    <p>
                      <strong>ID товара:</strong>{" "}
                      {selectedQuestion?.["productDetails"]?.["imtId"]}
                    </p>
                  </div>
                  <div className="closed-product-details">
                    <p
                      onClick={() => {
                        setProductInfoDisplay("none");
                      }}
                    >
                      Х
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="messages">
                <div className="message user">
                  <p>{selectedQuestion?.text}</p>
                  <span className="message-time">
                    {new Date(
                      selectedQuestion?.["createdDate"],
                    )?.toLocaleTimeString()}
                  </span>
                </div>

                {selectedQuestion?.["answer"] && (
                  <div className="message support">
                    <p>{selectedQuestion?.["answer"]}</p>
                    <span className="message-time">Ответ отправлен</span>
                  </div>
                )}
              </div>

              <div className="input-area">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e?.target?.value)}
                  placeholder="Напишите ответ..."
                />
              </div>
              {!messageLoading ? (
                <div className="input-area support-input-area-bottom">
                  <input type="file" multiple />
                  <button
                    onClick={async () =>
                      await sendMessageFunction(selectedQuestion?.id, answer)
                    }
                  >
                    Отправить ответ
                  </button>
                </div>
              ) : (
                <div className="input-area support-input-area-bottom"></div>
              )}
            </>
          ) : (
            <p className="no-selection">Выберите вопрос слева</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsWithSupport;
