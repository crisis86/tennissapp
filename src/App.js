import Navbar from './Navbar';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AppHeader from './AppHeader';
import Player from './Player';
import ChallengeList from './ChallengeList';
import Listasfida from './lista-sfida';
import ChallengeSingle from './Challenge-single';
import Mychallenge from './Mychallenge';
import Post from './Post';

function App() {
  return (
    <div className="App">
     <ToastContainer theme='colored' position='top-center'></ToastContainer>
     
   <BrowserRouter>
    <AppHeader></AppHeader>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/Player"element={<Player/>}> </Route>
      <Route path="/ChallengeList"element={<ChallengeList/>}> </Route>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/Register" element={<Register />}> </Route>
      <Route path="/lista-sfida" element={<Listasfida />}> </Route>
      <Route path="/Mychallenge" element={<Mychallenge />}> </Route>
      <Route path="/Post" element={<Post />}> </Route>
      <Route path="/Challenge-single/:id/:name" element={<ChallengeSingle />}> </Route>
      
    </Routes>
     </BrowserRouter> 

    {/*  <BrowserRouter>
     <AppHeader></AppHeader>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/Player' component={Player} />
          <Route path='/ChallengeList' component={ChallengeList} />
        </Switch>
      </BrowserRouter> */}
     
    </div>
  );
}

export default App;
