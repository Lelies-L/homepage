import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import './pages/index/pad.less';
import './pages/index/mobile.less';
import './pages/index/common.less';
// import App from './App';
import IRouter from './router.js';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <IRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

