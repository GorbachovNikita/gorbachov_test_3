import React, { useEffect, useState } from 'react';
import './Reviews.css';
import {getReviews, sendResponseToReview} from '../../http/reviews';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [filterRating, setFilterRating] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null);

    const getReviewsFunction = async () => {
        const response = await getReviews();
        if (response?.status === 200) {
            const data = response.data.data?.['feedbacks'] || [];
            const formattedReviews = data.map((item) => ({
                id: item.id,
                productImage: item.photoLinks?.[0]?.['fullSize'],
                productName: item.productDetails.productName,
                rating: item.productValuation,
                text: item.text || item.pros || '',
                date: new Date(item.createdDate).toLocaleDateString('ru-RU'),
                status: item.answer ? 'отвечен' : 'не отвечен',
                reply: item.answer || null,
                userName: item.userName,
            }));
            setReviews(formattedReviews);
        }
    };

    useEffect(() => {
        getReviewsFunction();
    }, []);

    const filteredReviews = filterRating
        ? reviews.filter((review) => review.rating === filterRating)
        : reviews;

    const sendResponse = async (reviewId) => {
        if (!replyText.trim()) return;

        const response = await sendResponseToReview(reviewId, replyText);

        if(response.status === 200) {
            setReviews(reviews.map(review =>
                review.id === reviewId
                    ? { ...review, status: 'отвечен', reply: replyText }
                    : review
            ));
            setActiveReplyId(null);
            setReplyText('');
        } else {
            alert('Ошибка при отправке ответа. Попробуйте ещё раз.');
        }
    };

    const handleHide = (id) => {
        setReviews(reviews.filter((review) => review.id !== id));
    };

    return (
        <div className="reviews-container">
            <h2>Отзывы покупателей</h2>

            <div className="filters">
                <button
                    className={filterRating === null ? 'active' : ''}
                    onClick={() => setFilterRating(null)}
                >
                    Все
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                        key={rating}
                        className={filterRating === rating ? 'active' : ''}
                        onClick={() => setFilterRating(rating)}
                    >
                        {rating} ★
                    </button>
                ))}
            </div>

            <div className="reviews-list">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="product-info">
                                {review.productImage && (
                                    <img
                                        src={review.productImage}
                                        alt={review.productName}
                                        className="product-img"
                                    />
                                )}
                                <div>
                                    <h3>{review.productName}</h3>
                                    <div className="rating">
                                        {Array(review.rating).fill('★').join('')}
                                        {Array(5 - review.rating).fill('☆').join('')}
                                    </div>
                                    <p className="review-author">Автор: {review.userName}</p>
                                </div>
                            </div>

                            <div className="review-content">
                                {review.text && (
                                    <p className="review-text">«{review.text}»</p>
                                )}
                                <p className="review-date">Дата: {review.date}</p>

                                <div className="review-status">
                                    <span className={`status ${review.status}`}>
                                        {review.status}
                                    </span>
                                    {review.reply && (
                                        <div className="reply">
                                            <strong>Ваш ответ:</strong> {review.reply}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="actions">
                                {activeReplyId === review.id ? (
                                    <div className="reply-form">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Введите ответ..."
                                            rows={3}
                                        />
                                        <div className="reply-buttons">
                                            <button
                                                onClick={() => sendResponse(review.id)}
                                                disabled={!replyText.trim()}
                                            >
                                                Отправить
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setActiveReplyId(null);
                                                    setReplyText('');
                                                }}
                                            >
                                                Отменить
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="btn-reply"
                                        onClick={() => setActiveReplyId(review.id)}
                                    >
                                        Ответить
                                    </button>
                                )}
                                <button
                                    className="btn-hide"
                                    onClick={() => handleHide(review.id)}
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
        </div>
    );
};

export default Reviews;
