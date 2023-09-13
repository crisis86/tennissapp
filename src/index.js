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

window.$servEmail ="https://servermail-fhuv.onrender.com"


window.$devurl = "https://tennissapp.onrender.com";
window.$produrl = "http://localhost:10000";
     
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <> 
    <App /> 
    </>
  //</React.StrictMode>
);
