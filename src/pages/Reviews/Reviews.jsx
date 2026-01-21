import React, { useEffect, useState } from "react";
import "./Reviews.css";
import { getReviews, sendResponseToReview } from "../../http/reviews";
import ErrorsBlock from "../../components/ErrorsBlock";
import { errorHandling } from "../../functions/errorHandling";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [errors, setErrors] = useState([]);
  const [errorsDisplay, setErrorsDisplay] = useState("none");
  const [loading, setLoading] = useState(false);

  const getReviewsFunction = async (this_page = 1) => {
    window.scrollTo(0, 0);
    setErrors([]);
    setErrorsDisplay("none");
    setLoading(true);
    const response = await getReviews(this_page);
    if (response?.status === 200) {
      const data = response?.data?.data?.["feedbacks"] || [];
      const formattedReviews = data?.map((item) => ({
        id: item?.id,
        productImage: item?.["photoLinks"]?.[0]?.["fullSize"],
        productName: item?.["productDetails"]?.productName,
        rating: item?.["productValuation"],
        text: item?.text || item?.["pros"] || "",
        date: new Date(item?.["createdDate"])?.toLocaleDateString("ru-RU"),
        status: item?.["answer"] ? "отвечен" : "не отвечен",
        reply: item?.["answer"] || null,
        userName: item?.userName,
      }));
      setReviews(formattedReviews);
      setPage(this_page);
    } else {
      errorHandling(response, setErrors, setErrorsDisplay);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    window.scrollTo(0, 0);
    getReviewsFunction(1)?.then(() => {});
  }, []);

  const filteredReviews = filterRating
    ? reviews?.filter((review) => review?.rating === filterRating)
    : reviews;

  const sendResponse = async (reviewId) => {
    if (!replyText?.trim()) return;
    setErrors([]);
    setErrorsDisplay("none");
    const response = await sendResponseToReview(reviewId, replyText);
    if (response.status === 200) {
      setReviews(
        reviews?.map((review) =>
          review?.id === reviewId
            ? { ...review, status: "отвечен", reply: replyText }
            : review,
        ),
      );
      setActiveReplyId(null);
      setReplyText("");
    } else {
      errorHandling(response, setErrors, setErrorsDisplay);
    }
  };

  const handleHide = (id) => {
    setReviews(reviews?.filter((review) => review?.id !== id));
  };

  return (
    <div className="reviews-container">
      <div className="reviews-errors">
        <ErrorsBlock
          errors={errors}
          display={errorsDisplay}
          setDisplay={setErrorsDisplay}
        />
      </div>

      <h2>Отзывы покупателей</h2>

      <div className="filters no-select">
        <button
          className={filterRating === null ? "active" : ""}
          onClick={() => setFilterRating(null)}
        >
          Все
        </button>
        {[5, 4, 3, 2, 1]?.map((rating) => (
          <button
            key={rating}
            className={filterRating === rating ? "active" : ""}
            onClick={() => setFilterRating(rating)}
          >
            {rating} ★
          </button>
        ))}
      </div>

      <div className="reviews-list">
        {loading ? (
          <p>Загрузка...</p>
        ) : filteredReviews?.length > 0 ? (
          filteredReviews?.map((review) => (
            <div key={review?.id} className="review-card">
              <div className="product-info">
                {review?.productImage && (
                  <img
                    src={review?.productImage}
                    alt={review?.productName}
                    className="product-img"
                  />
                )}
                <div>
                  <h3>{review?.productName}</h3>
                  <div className="rating">
                    {Array(review?.rating)?.fill("★")?.join("")}
                    {Array(5 - review?.rating)
                      ?.fill("☆")
                      ?.join("")}
                  </div>
                  <p className="review-author">
                    Автор: {review?.userName || "Неизвестно"}
                  </p>
                </div>
              </div>

              <div className="review-content">
                {review?.text && (
                  <p className="review-text">«{review?.text}»</p>
                )}
                <p className="review-date">Дата: {review?.date}</p>

                <div className="review-status">
                  <span className={`status ${review?.status}`}>
                    {review?.status}
                  </span>
                  {review?.reply && (
                    <div className="reply">
                      <strong>Ваш ответ:</strong> {review?.reply}
                    </div>
                  )}
                </div>
              </div>

              <div className="actions">
                {activeReplyId === review?.id ? (
                  <div className="reply-form">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e?.target?.value)}
                      placeholder="Введите ответ..."
                      rows={3}
                    />
                    <div className="reply-buttons">
                      <button
                        onClick={() => sendResponse(review?.id)}
                        disabled={!replyText?.trim()}
                        className="no-select"
                      >
                        Отправить
                      </button>
                      <button
                        onClick={() => {
                          setActiveReplyId(null);
                          setReplyText("");
                          setErrors([]);
                          setErrorsDisplay("none");
                        }}
                        className="no-select"
                      >
                        Отменить
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn-reply no-select"
                    onClick={() => setActiveReplyId(review?.id)}
                  >
                    Ответить
                  </button>
                )}
                <button
                  className="btn-hide no-select"
                  onClick={() => handleHide(review?.id)}
                >
                  Скрыть
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Отзывов пока нет.</p>
        )}
      </div>

      {!loading ? (
        <div className="pagination no-select">
          {page > 3 && (
            <button
              className={`pagination-button ${page === 1 ? "active" : ""}`}
              onClick={() => getReviewsFunction(1)}
              disabled={page === 1}
            >
              1
            </button>
          )}

          {page > 3 && <span className="pagination-gap">...</span>}

          {Array?.from({ length: 5 }, (_, index) => {
            let pageNum;

            if (page <= 3) {
              pageNum = index + 1;
            } else {
              pageNum = page - 2 + index;
            }

            return (
              <button
                key={pageNum}
                className={`pagination-button ${pageNum === page ? "active" : ""}`}
                onClick={() => getReviewsFunction(pageNum)}
                disabled={pageNum === page}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Reviews;
