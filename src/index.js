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

 
window.$produrl = "https://tennissapp.onrender.com";
window.$devurl = "http://localhost:10000";

const cron =require('node-schedule');

   
cron.scheduleJob('* * * * *', () => {
  const current = new Date();
 const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} : ${current.getHours()}-${current.getMinutes()}-${current.getSeconds()}`;
  console.log('running a task every minute', date);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <> 
    <App /> 
    </>
  //</React.StrictMode>
);
