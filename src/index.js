import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import './assets/App.css';
import './assets/Navbar.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
window.$mainteneance = "off";


window.$servEmail ="https://servermail-fhuv.onrender.com";

window.$produrl = "https://tennissapp.onrender.com";
window.$devurl = "http://localhost:10000";
     
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <> 
    <App />   
    </>
  //</React.StrictMode>
);
