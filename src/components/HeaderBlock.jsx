import React from "react";
import { Link } from "react-router-dom";
import "./HeaderBlock.css";

const HeaderBlock = () => {
  return (
    <div className="header">
      <nav className="nav-menu">
        <Link to="/feed" className="nav-link no-select">
          Главная
        </Link>
        <Link to="/reviews" className="nav-link no-select">
          Отзывы
        </Link>
        <Link to="/chatsWithCustomers" className="nav-link no-select">
          Чаты с покупателями
        </Link>
        <Link to="/chatsWithSupport" className="nav-link no-select">
          Тех. поддержка
        </Link>
      </nav>
    </div>
  );
};

export default HeaderBlock;
