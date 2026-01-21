import './App.css';
import PageTitle from "./components/PageTitle";
import AppRouter from "./components/AppRouter";
import {observer} from "mobx-react-lite";
import {BrowserRouter} from "react-router-dom";
import HeaderBlock from "./components/HeaderBlock";

const App = observer(() => {

  return (
      <BrowserRouter>
          <PageTitle />
          <HeaderBlock />
          <AppRouter />
      </BrowserRouter>
  );
});

export default App;