import React, { useEffect, useState } from 'react';
import './ChatsWithSupport.css';
import { getQuestions } from '../../http/chatsWithSupport';

const ChatsWithSupport = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [questions, setQuestions] = useState([]);

    const getQuestionsFunction = async () => {
        try {
            const response = await getQuestions();
            if (response?.status === 200) {
                setQuestions(response.data.data.questions);
            }
        } catch (error) {
            console.error('Ошибка загрузки вопросов:', error);
        }
    };

    useEffect(() => {
        getQuestionsFunction();
    }, []);

    return (
        <div className="support-chats-container">
            <h2>Вопросы пользователей</h2>

            <div className="chats-layout">
                <div className="chats-list">
                    {questions.map((question) => (
                        <div
                            key={question.id}
                            className={`chat-item ${selectedQuestion?.id === question.id ? 'active' : ''}`}
                            onClick={() => setSelectedQuestion(question)}
                        >
                            <div className="chat-info">
                                <strong>{question.text}</strong>
                                <p>
                                    <strong>Товар:</strong> {question.productDetails.productName}
                                </p>
                                <p>
                                    <strong>Бренд:</strong> {question.productDetails.brandName}
                                </p>
                            </div>
                            <div className="chat-meta">
                <span className="chat-date">
                  {new Date(question.createdDate).toLocaleString()}
                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chat-window">
                    {selectedQuestion ? (
                        <>
                            <div className="chat-header">
                                <h3>Вопрос от {new Date(selectedQuestion.createdDate).toLocaleDateString()}</h3>
                                <span className="status-badge">
                  {selectedQuestion.state}
                </span>
                            </div>

                            <div className="messages">
                                <div className="message user">
                                    <p>{selectedQuestion.text}</p>
                                    <span className="message-time">
                    {new Date(selectedQuestion.createdDate).toLocaleTimeString()}
                  </span>
                                </div>

                                {selectedQuestion.answer && (
                                    <div className="message support">
                                        <p>{selectedQuestion.answer}</p>
                                        <span className="message-time">Ответ отправлен</span>
                                    </div>
                                )}
                            </div>

                            <div className="input-area">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Напишите ответ..."
                                />
                                <button>Отправить ответ</button>
                            </div>
                            <div className="input-area">
                                <input
                                    type="file"
                                    multiple
                                />
                            </div>

                            <div className="product-details">
                                <h4>Детали товара</h4>
                                <p><strong>Название:</strong> {selectedQuestion.productDetails.productName}</p>
                                <p><strong>Бренд:</strong> {selectedQuestion.productDetails.brandName}</p>
                                <p><strong>Артикул:</strong> {selectedQuestion.productDetails.supplierArticle}</p>
                                <p><strong>ID товара:</strong> {selectedQuestion.productDetails.imtId}</p>
                            </div>
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
