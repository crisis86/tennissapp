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
import Mychallenge from './Mychallenge';
import Post from './Post';
import { useState, useEffect } from 'react';
import index from 'toastify';



function App() {

  const [challenge, setchallenge] = useState([]);
  const [classifica, setclassifica] = useState([]);
  const iduser = parseInt(sessionStorage.getItem('iduser'))

  const cron = require('node-schedule');

  useEffect(() => {
    cron.scheduleJob('*/10 * * * *', () => {
      const current = new Date();
      const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} : ${current.getHours()}-${current.getMinutes()}-${current.getSeconds()}`;
      console.log('running a task every minute', date);

      controllasfide();
      // loadchallenge();
    });
  }, [])

  


  function controllasfide() {


    fetch(window.$produrl + "/challenge?status!=complete", {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    }).then(res => {
      if (!res.ok) {
        // console.log('nulla')
        return false
      }
      return res.json();
    }).then(resp => {

      let challenger = resp;
      setchallenge(resp)
      //console.log(challenger);


      console.log((challenger));

      const current = new Date();
      const currentDate = current.getDate();
      let datasfida = new Date();

      const found = challenger.filter((obj, index) => {
       // console.log(obj.status)
        if (obj.status === 'pending' || obj.status === 'processing') {

          datasfida = Date.parse(obj.datasfida.toString());
          const currentDay = current.getDate();

          // if (currentDay + 2 > currentDate) {
            if (currentDay === currentDay) {
            console.log('sfida scaduta tra ' + obj.players[0].p1 + " VS " + obj.players[1].p2)

            obj.status = 'cancel';

                cancelchallenge(obj, obj.id)
                penalizzazione(obj.players[0].idp1, obj.players[1].idp2)

          } else {
            console.log('sfida in attesa di risposta')
          }

        } else {
         // console.log('sfida trovata in status:' + obj.status)
        }
        return obj.id
      });
    });
  }

  function cancelchallenge(objchallenge, idriga) {

    fetch(window.$produrl + "/challenge/" + idriga, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objchallenge)
    }).then((result) => {
      //  console.log(result)
      result.json().then((resp) => {
        console.log('chanllenge in status cancel :' + objchallenge.id)

      })
    }).catch((err) => {

      console.log(err.message)
    });

  }

  function penalizzazione(idp1, idp2) {

    fetch(window.$produrl + "/user?role=player", {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    }).then(res => {
      if (!res.ok) {
        // console.log('nulla')
        return false
      }
      return res.json();
    }).then(resp => {

      let plrlist = resp;
    
      //console.log(plrlist);
   
    let posp1 = 0
    let posp2 = 0
    const cercapos1 = plrlist.filter(obj => {
      if (obj.id === idp1) {
        posp1 = obj.posizione;
      }
      return posp1
    })
    const cercapos2 = plrlist.filter(obj => {
      if (obj.id === idp2) {
        posp2 = obj.posizione;
      }
      return posp2
    })
    console.log(posp1);
    console.log(posp2);
    const foundannullaforzato = plrlist.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((obj, index) => {

      if (obj.id === idp1) {

        obj.insfida = false;
        obj.posizione = posp1 + 1 // scendo di 1 perchè ho annullato
        console.log("pod do chi anulla:" + obj.posizione)
        updateUserPosition(obj)

      } if (index + 1 === posp1 + 1) {

        obj.posizione = obj.posizione - 1 // sale di uno quello sotto
        console.log("sale di uno quello sotto", obj.posizione)
        updateUserPosition(obj)

      } if (obj.id === idp2) {

        obj.insfida = false;
        obj.posizione = posp2 + 1  // scendo di 1 perchè ho annullato
        console.log("sale di uno subisce annullo", obj.posizione)
        updateUserPosition(obj)
      }
      if (index + 1 === posp2 + 1) {

        obj.posizione = obj.posizione - 1 // sale di uno quello sotto
        console.log("scendi uno quello sopra", obj.posizione)
        updateUserPosition(obj)
      }
      return obj.id

    })
    if (idp1 === iduser || idp2 === iduser) {
      sessionStorage.setItem('stoinsfida', false);
    }
  });
  }
  function updateUserPosition(ogettogioc) {

    fetch(window.$produrl + "/user/" + ogettogioc.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ogettogioc)
    }).then((result) => {
      //  console.log(result)
      result.json().then((resp) => {
        console.log("Classifica aggiornata iduser: ", ogettogioc.id)

      })
    }).catch((err) => {
      console.log(err.message);
    });
  }

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
