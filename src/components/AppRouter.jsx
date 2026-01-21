import {privateRouters} from "../routes";
import {observer} from "mobx-react-lite";
import {Route, Routes} from "react-router-dom";

const AppRouter = observer(() => {
    return (
        <Routes>
            {privateRouters.map((route) => <Route key={route.path} path={route.path} element={<route.element />}/>)}
        </Routes>
    );
});

export default AppRouter;