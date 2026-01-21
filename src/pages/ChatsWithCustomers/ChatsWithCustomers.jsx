import React, { useEffect, useState } from 'react';
import './ChatsWithCustomers.css';
import {getChats, getMessages, sendMessage} from '../../http/chatsWithCustomers';

const ChatsWithCustomers = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messageText, setMessageText] = useState('');

    const getChatsFunction = async () => {
        const response = await getChats();

        if (response?.status === 200) {

            const formattedChats = response.data.result.map(chat => ({
                id: chat.chatID,
                customerName: chat.clientName || 'Неизвестно',
                lastMessage: chat.lastMessage?.text || 'Нет сообщений',
                date: chat.lastMessage?.addTimestamp
                    ? new Date(chat.lastMessage.addTimestamp).toLocaleDateString('ru-RU')
                    : '',
                unread: 0,
                messages: []
            }));

            setChats(formattedChats);

            const response_messages = await getMessages();

            if (response_messages?.status === 200) {

                const messagesByChat = response_messages.data.result.events.reduce((acc, message) => {
                    const chatId = message.chatID;
                    if (!acc[chatId]) {
                        acc[chatId] = [];
                    }
                    acc[chatId].push(message);
                    return acc;
                }, {});

                const updatedChats = formattedChats.map(chat => {
                    if (messagesByChat[chat.id]) {
                        return {
                            ...chat,
                            messages: messagesByChat[chat.id]
                        };
                    }
                    return chat;
                })
                    ?.sort((a, b) => {
                        if (a.messages.length > 0 && b.messages.length === 0) {
                            return -1;
                        }
                        if (b.messages.length > 0 && a.messages.length === 0) {
                            return 1;
                        }
                        return 0;
                    });

                console.log(updatedChats)

                setChats(updatedChats);
            }
        }
    };

    const sendMessageFunction = async (chatId, text) => {

        const response = await sendMessage(chatId, text);

        if(response?.status === 200) {

            let messagePayload = {
                chatID: chatId,
                eventType: 'message',
                message: {
                    text: text
                },
                source: 'seller-portal',
                addTimestamp: Date.now(),
                addTime: new Date().toISOString(),
                sender: 'seller'
            };

            setChats((prevChats) =>
                prevChats.map((chat) => {
                    if (chat.id === chatId) {
                        return {
                            ...chat,
                            messages: [...chat.messages, messagePayload],
                            lastMessage: text,
                            date: new Date().toISOString()
                        };
                    }

                    return chat;
                })
            );

        } else {
            alert('При отправке сообщения произошла ошибка')
        }
    }

    useEffect(() => {
        getChatsFunction();
    }, []);

    return (
        <div className="chats-container">
            <h2>Чаты с покупателями</h2>

            <div className="chats-layout">
                <div className="chats-list">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
                            onClick={() => setSelectedChat(chat.id)}
                        >
                            <div className="chat-info">
                                <strong>{chat.customerName}</strong>
                                <p>{chat.lastMessage}</p>
                            </div>
                            <div className="chat-meta">
                                <span className="chat-date">{chat.date}</span>
                                {chat.unread > 0 && (
                                    <span className="unread-count">{chat.unread}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-window">
                    {selectedChat ? (
                        <>
                            <div className="messages">
                                {chats
                                    .find(chat => chat.id === selectedChat)
                                    ?.messages.map(msg => (
                                        <div
                                            key={msg.eventID}
                                            className={`message ${msg.sender === 'client' ? 'me' : 'customer'}`}
                                        >
                                            <p>{msg.message.text || 'Нет текста'}</p>
                                            <span className="message-time">
                                                {new Date(msg.addTimestamp).toLocaleString('ru-RU')}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                            <div className="input-area">
                                <input
                                    type="text"
                                    placeholder="Напишите сообщение..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                />
                                <button
                                    onClick={async () => {
                                        await sendMessageFunction(selectedChat, messageText)
                                    }}
                                >Отправить</button>
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
