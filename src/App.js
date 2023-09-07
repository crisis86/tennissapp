import Navbar from './Navbar';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Home';
import Logout from './Logout';
import Login from './Login';
import Register from './Register';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import Player from './Player';
import Edit from './Edit';
import ChallengeList from './ChallengeList';
import Listasfida from './lista-sfida';
import ChallengeSingle from './Challenge-single';
import Mychallenge from './Mychallenge'
import Post from './Post';
import { useState, useEffect } from 'react';
import index from 'toastify';



function App() {

  const [challenge, setchallenge] = useState([]);
  const [classifica, setclassifica] = useState([]);
  const iduser = parseInt(sessionStorage.getItem('iduser'))

 

//  useEffect(() => {
 //   cron.scheduleJob('*/10 * * * *', () => {
  //    const current = new Date();
   //   const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} : ${current.getHours()}-${current.getMinutes()}-${current.getSeconds()}`;
   //   console.log('running a task every minute', date);

//      controllasfide();
      // loadchallenge();
 //   });
//  }, [])

  return (
    <div className="App">
      <ToastContainer theme='colored' autoClose='2000' position='top-center'></ToastContainer>

      <BrowserRouter>
        <AppHeader></AppHeader>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Player" element={<Player />}> </Route>
          <Route path="/ChallengeList" element={<ChallengeList />}> </Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Logout" element={<Logout />}></Route>
          <Route path="/Register" element={<Register />}> </Route>
          <Route path="/lista-sfida" element={<Listasfida />}> </Route>
          <Route path="/Mychallenge" element={<Mychallenge />}> </Route>
          <Route path="/Post" element={<Post />}> </Route>
          <Route path="/Edit/:id" element={<Edit />}> </Route>
          <Route path="/Challenge-single/:id/:name" element={<ChallengeSingle />}> </Route>


        </Routes>
        <AppFooter></AppFooter>
      </BrowserRouter>


    </div>
  );
}

export default App;
