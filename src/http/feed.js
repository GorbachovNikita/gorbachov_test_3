import {$host} from "./index";

export const sellerInfo = async () => {
    try {
        return $host
            .get('https://common-api.wildberries.ru/api/v1/seller-info')
            .catch((e) => {
                return e;
            });
    } catch (e) {
        return e;
    }
}
