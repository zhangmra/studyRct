import React from 'react';
import './App.css';
import IndexRouter from "./router";
import { HashRouter } from "react-router-dom";

//全局引入redux
import { Provider } from 'react-redux';
import {persistor, store} from './redux/Store';
//redux持久化
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
      // redux全局使用
      <Provider store={store}>
          {/*redux持久化*/}
          <PersistGate loading={null} persistor={ persistor }>
              <HashRouter>
                  <IndexRouter />
              </HashRouter>
          </PersistGate>
      </Provider>
  )
}

export default App;
