import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = ({ title }) => {
    const location = useLocation();

    let pagesTitle = {
        '/': 'Главная',
        '/feed': 'Главная',
        '/reviews': 'Отзывы',
        '/chatsWithSupport': 'Чаты с Тех. поддержкой',
        '/chatsWithCustomers': 'Чаты с Покупателями',
    }

    title = title || pagesTitle[location.pathname];

    if (title === undefined) {
        title = 'Страница не найдена';
    }

    useEffect(() => {
        document.title = title;
    }, [location, title]);

    return null;
};

export default PageTitle;