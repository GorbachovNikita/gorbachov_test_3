import React from 'react';
import {Link} from "react-router-dom";
import './HeaderBlock.css';

const HeaderBlock = () => {

    return (
        <div className="header">
            <nav className="nav-menu">
                <Link to="/feed" className="nav-link">Главная</Link>
                <Link to="/reviews" className="nav-link">Отзывы</Link>
                <Link to="/chatsWithCustomers" className="nav-link">Чаты с покупателями</Link>
                <Link to="/chatsWithSupport" className="nav-link">Чаты с техподдержкой</Link>
            </nav>
        </div>
    );
};

export default HeaderBlock;