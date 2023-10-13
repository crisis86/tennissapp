import Navbar from './Navbar';
import { React, useEffect } from 'react';
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
import Regolamento from './Regolamento';
import AdminChallenge from './AdminChallenge';
import EditChallenge from './EditChallenge';
import Mainteneance from './mainteneance';



function App() {


  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // const cron = require('node-schedule')
    //  cron.scheduleJob('*/100 * * * *', () => {    

    //)
    // console.log('running a task every  minute', new Date());
    //  });


  }, [])


  return (
    <div className="App">
      <ToastContainer theme='colored' autoClose='2000' position='top-center'></ToastContainer>

      <BrowserRouter>
        <AppHeader></AppHeader>
        <Navbar />
        <Routes>
          <Route path="/Regolamento.html" element={<Regolamento />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Player" element={<Player />}> </Route>
          <Route path="/ChallengeList" element={<ChallengeList />}> </Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Logout" element={<Logout />}></Route>
          <Route path="/Register" element={<Register />}> </Route>
          <Route path="/lista-sfida" element={<Listasfida />}> </Route>
          <Route path="/Mychallenge" element={<Mychallenge />}> </Route>
          <Route path="/Post" element={<Post />}> </Route>
          <Route path="/mainteneance" element={<Mainteneance />}> </Route>
          <Route path="/Edit/:id" element={<Edit />}> </Route>
          <Route path="/AdminChallenge" element={<AdminChallenge />}> </Route>
          <Route path="/EditChallenge/:id" element={<EditChallenge />}> </Route>
          <Route path="/Challenge-single/:id/:name" element={<ChallengeSingle />}> </Route>


        </Routes>
        <AppFooter></AppFooter>
      </BrowserRouter>


    </div>
  );
}

export default App;
