import React, {useEffect, useState} from 'react';
import './Feed.css';
import {sellerInfo} from "../../http/feed";

const Feed = () => {

    const [userData, setUserData] = useState({});

    const sellerInfoFunction = async () => {

        const response = await sellerInfo();

        if(response?.status === 200) {
            setUserData(response?.data)
        }

    }

    useEffect(() => {

        sellerInfoFunction();

    }, [])

    return (
        <div className="feed-container">

            <div className="account-info">
                <strong>Аккаунт:</strong> Продавец {userData?.name}
            </div>

            <header className="feed-header">
                <h1>Панель продавца Wildberries</h1>
                <p>Управление отзывами и чатами в одном месте</p>
            </header>
        </div>
    );
};

export default Feed;