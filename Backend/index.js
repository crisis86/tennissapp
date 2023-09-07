import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';

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