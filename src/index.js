import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import './assets/App.css';
import './assets/Navbar.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
window.$mainteneance = "off";

window.$servEmail = "https://servermail-fhuv.onrender.com";

//window.$devurl = "https://tennissapp.onrender.com";
// window.$produrl = "http://localhost:10000";

if (sessionStorage.getItem('club') !== '' || sessionStorage.getItem('club') !== undefined) {
  if (sessionStorage.getItem('club') === 'DM00') {

  window.$produrl = "https://tennissapp.onrender.com";
// window.$produrl = "http://localhost:10000";

  } else if (sessionStorage.getItem('club') === 'DM01') {
 //   url db di altro club
  } else {
    console.log(window.$produrl);
  }
} else {

  window.$produrl = null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <>
    <App />
  </>
  //</React.StrictMode>
);
