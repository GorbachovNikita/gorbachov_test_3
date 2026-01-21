import {$host} from "./index";

export const getQuestions = async () => {
    try {
        return $host
            .get('https://feedbacks-api.wildberries.ru/api/v1/questions', {
                params: {
                    isAnswered: false,
                    take: 10,
                    skip: 0,
                }
            })
            .catch((e) => {
                return e;
            });
    } catch (e) {
        return e;
    }
}
