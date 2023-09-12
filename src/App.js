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

function App() {  


  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  
    const cron = require('node-schedule')
    cron.scheduleJob('*/10 * * * *', () => {    
 
       controllasfide();
      console.log('running a task every 10 minute', new Date());
    });


  }, [])




  function controllasfide() {
 
    fetch("https://tennissapp.onrender.com/challenge?status!=complete", {
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
   
      //console.log(challenger);
  
  
      console.log((challenger));
  
      const current = new Date();
    //  const currentDate = current.getDate();
      
  
            
      const found = challenger.filter((obj, index) => {
       // console.log(obj.status)
        if (obj.status === 'processing') {
  
        let datasdellfida = Date.parse(obj.datasfida.toString());
          
        let splidate = datasdellfida.datasfida.split("/")
        let dataconvert = new Date(splidate[2] + "/" + splidate[1] + "/" + splidate[0])
  
          const time = Math.abs(dataconvert - current);
          const days = Math.ceil(time / (1000 * 60 * 60 * 24));
          console.log(days);
  
          // idays > 2{
            if (days === days) {
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
  
    fetch("https://tennissapp.onrender.com/challenge/" + idriga, {
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
  
    fetch("https://tennissapp.onrender.com/user?role=player", {
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
        if (!Object.keys(plrlist).length <= index +1) { //controllo la fine della classifica
            obj.posizione = posp1 + 1 // scendo di 1 perchè ho annullato
        }
        console.log("pod do chi anulla:" + obj.posizione)
        updateUserPosition(obj)
  
    } if (index + 1 === posp1 + 1) {
  
        obj.posizione = obj.posizione - 1 // sale di uno quello sotto
        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
        console.log("sale di uno quello sotto", obj.posizione)
        updateUserPosition(obj)
  
    } if (obj.id === idp2) {
  
        obj.insfida = false;
        if (!Object.keys(plrlist).length <= index +1)  { //controllo la fine della classifica
            obj.posizione = posp2 + 1  // scendo di 1 perchè ho annullato
        }
        console.log("sale di uno subisce annullo", obj.posizione)
        updateUserPosition(obj)
    }
    if (index + 1 === posp2 + 1) {
  
        obj.posizione = obj.posizione - 1 // sale di uno quello sotto
        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
        console.log("scendi uno quello sopra", obj.posizione)
        updateUserPosition(obj)
    }
      return obj.id
  
    })
    
  });
  }
  function updateUserPosition(ogettogioc) {
  
    fetch("https://tennissapp.onrender.com/user/" + ogettogioc.id, {
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
          <Route path="/Edit/:id" element={<Edit />}> </Route>
          <Route path="/Challenge-single/:id/:name" element={<ChallengeSingle />}> </Route>


        </Routes>
        <AppFooter></AppFooter>
      </BrowserRouter>


    </div>
  );
}

export default App;
