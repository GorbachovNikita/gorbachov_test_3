import React, { useEffect, useState } from "react";
import "./Feed.css";
import { sellerInfo } from "../../http/feed";
import ErrorsBlock from "../../components/ErrorsBlock";
import { errorHandling } from "../../functions/errorHandling";

const Feed = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorsDisplay, setErrorsDisplay] = useState("none");

  const sellerInfoFunction = async () => {
    setLoading(true);
    setErrors([]);
    setErrorsDisplay("none");
    const response = await sellerInfo();
    if (response?.status === 200) {
      setUserData(response?.data);
    } else {
      errorHandling(response, setErrors, setErrorsDisplay);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    window.scrollTo(0, 0);
    sellerInfoFunction()?.then(() => {});
  }, []);

  return (
    <div className="feed-container">
      <ErrorsBlock
        display={errorsDisplay}
        errors={errors}
        setDisplay={setErrorsDisplay}
      />

      <div className="account-info">
        {loading ? (
          <span>Загрузка...</span>
        ) : userData?.name?.length ? (
          <span>
            <strong>Аккаунт:</strong> Продавец {userData?.name}
          </span>
        ) : (
          <span>
            Данные аккаунта не загружены{" "}
            <button className="nav-link no-select" onClick={sellerInfoFunction}>
              Обновить
            </button>
          </span>
        )}
      </div>

      <header className="feed-header">
        <h1>Панель продавца Wildberries</h1>
        <p>Управление отзывами и чатами в одном месте</p>
      </header>
    </div>
  );
};

export default Feed;
