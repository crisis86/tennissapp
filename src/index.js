import logo from './assets/logo.svg';
import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import './assets/App.css';
import './assets/Navbar.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <> 
    <App /> 
    </>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

//reportWebVitals();
