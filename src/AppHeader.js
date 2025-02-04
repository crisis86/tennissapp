import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as FaIcons from 'react-icons/fa';

const Appheader = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();
    const club = sessionStorage.getItem('club');
    const [badge, setbadge] = useState(false)
    const datiuserloging = JSON.parse(localStorage.getItem('datiuserlogin'))

    //const [contatore, setcount] = useState(0);



    useEffect(() => {
        if (club === "" || club === undefined) {
           // non fa nulla
        } else { 
        
         controllasfide()
         controllpending();
         controllafuorigioco()

        const cron = require('node-schedule')
        cron.scheduleJob('*/1 * * * *', () => {
          
           // controllasfide()
          //  controllpending();
          //  controllafuorigioco()

            console.log('running a task every 1min', new Date());
        });
    }
    }, [])

    useEffect(() => {

         
          //  let count = parseInt(sessionStorage.getItem("onlineUsers") || "0", 10);
          //  count += 1;
          //  sessionStorage.setItem("onlineUsers", count);
          //  setcount(count);
     

        if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/Regolamento.html') {
            showmenuupdateupdate(false);
        } else {
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('iduser');
            if (username === '' || username === null) {
              //  usenavigate('/login');
            } else {
                displayusernameupdate(username);

            }
        }

    }, [location])

   

    function controllasfide() {

        fetch(window.$produrl + "/challenge?status=processing&codiceclub=" + club, {
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
                if (obj.datasfida === '' || obj.datasfida === null) {

                    let datasdellfida = obj.datacreate;

                    let splidate = datasdellfida.split("/")
                    let dataconvert = new Date(splidate[2] + "/" + splidate[1] + "/" + splidate[0])

                    const time = Math.abs(dataconvert - current);
                    const days = Math.ceil(time / (1000 * 60 * 60 * 24));
                    console.log(days);

                    // idays > 2{
                    if (days > 2) {
                        console.log('sfida scaduta tra ' + obj.players[0].p1 + " VS " + obj.players[1].p2)

                        
                        let giorno = current.getDate()
                        let mese = current.getMonth() + 1
                        let anno = current.getFullYear()
                        
                        obj.status = 'cancel';
                        obj.datasfida = giorno + "/" + mese + "/" + anno;

                        cancelchallenge(obj, obj.id)
                        penalizzazione(obj.players[0].idp1, obj.players[1].idp2)

                    } else {
                        console.log('sfida in attesa di risposta')
                    }

                } else {
                    console.log('sfida trovata in status:' + obj.status)
                }
                return obj.id
            });
        });
    }


    function controllpending() {

        fetch(window.$produrl + "/challenge?status=pending&codiceclub=" + club, {
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
                if (obj.datasfida === '' || obj.datasfida === null) {

                    let datasdellfida = obj.datacreate;

                    let splidate = datasdellfida.split("/")
                    let dataconvert = new Date(splidate[2] + "/" + splidate[1] + "/" + splidate[0])

                    const time = Math.abs(dataconvert - current);
                    const days = Math.ceil(time / (1000 * 60 * 60 * 24));
                    console.log(days);
                    

                    // idays > 2{
                    if (days > 2) {
                        console.log('sfida scaduta tra ' + obj.players[0].p1 + " VS " + obj.players[1].p2)

                        let giorno = current.getDate()
                        let mese = current.getMonth() + 1
                        let anno = current.getFullYear()
 
    
                        obj.status = 'cancel';
                        obj.datasfida = giorno + "/" + mese + "/" + anno;
                        obj.finalplayer =null;

                        cancelchallenge(obj, obj.id)
                        penalizzazionePending(obj.players[0].idp1, obj.players[1].idp2)

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

        fetch(window.$produrl + "/user?role=player&codiceclub=" + club, {
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

                    if (obj.posizione !== 1) {

                        if (Object.keys(plrlist).length > index + 1) { //controllo la fine della classifica
                            obj.posizione = posp1 + 1 // scendo di 1 perchè ho annullato
                        }
                    }
                    console.log("pod do chi anulla:" + obj.posizione)
                    updateUserPosition(obj)

                } if (index + 1 === posp1 + 1) {
                    if (obj.id !== idp2) {
                        obj.posizione = obj.posizione - 1 // sale di uno quello sotto
                        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
                        console.log("sale di uno quello sotto", obj.posizione)
                        updateUserPosition(obj)
                    } else {
                        obj.insfida = false;
                        updateUserPosition(obj)
                    }
                } if (obj.id === idp2) {
                    obj.insfida = false;
                    if (obj.posizione !== 1) {

                        if (Object.keys(plrlist).length > index + 1) { //controllo la fine della classifica
                            obj.posizione = posp2 + 1  // scendo di 1 perchè ho annullato
                        }
                    }
                    console.log("sale di uno subisce annullo", obj.posizione)
                    updateUserPosition(obj)

                }
                if (index + 1 === posp2 + 1) {
                    if (obj.id !== idp1) {
                        obj.posizione = obj.posizione - 1 // sale di uno quello sotto
                        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
                        console.log("scendi uno quello sopra", obj.posizione)
                        updateUserPosition(obj)
                    } else {
                        obj.insfida = false;
                        updateUserPosition(obj)
                    }
                }

            })

        });
    }
    function controllafuorigioco() {

        fetch(window.$produrl + "/user?role=player&fuorigioco=true&codiceclub=" + club, {
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

            let userfuorigioco = resp;

            //console.log(userfuorigioco);

            console.log((userfuorigioco));
            const current = new Date();
            //  const currentDate = current.getDate();

            const found = userfuorigioco.filter((obj, index) => {
                console.log(current)
                if (obj.datafuorigioco !== '' || obj.datafuorigioco !== null) {

                    let fuoridata = obj.datafuorigioco;

                    let splidate = fuoridata.split("/")
                    let dataconvert = new Date(splidate[2] + "/" + splidate[1] + "/" + splidate[0])
                    console.log(fuoridata);
                    console.log(dataconvert);

                    const time = Math.abs(dataconvert - current);
                    const days = Math.ceil(time / (1000 * 60 * 60 * 24));
                    console.log(days);


                    if (days >= 6) {
                        console.log('Fuorigioco >= di 6 giorni')

                        penalizzazionesingola(obj.id)
                        console.log('penalizzo:', obj.name)
                    } else {
                        console.log('Fuorigioco Dentro i 6 giorni')
                    }

                } else {
                    console.log('nessuna data da fuorigioco da controllare')
                }
                return obj.id
            });
        });
    }

    function penalizzazionesingola(idp1) {

        fetch(window.$produrl + "/user?role=player&codiceclub=" + club, {
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

            const cercaposiz1 = plrlist.filter(obj => {
                if (obj.id === idp1) {
                    posp1 = obj.posizione;
                }
                return posp1
            })


            console.log(posp1);


            const foundplayeroffside = plrlist.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((obj, index) => {

                if (obj.id === idp1) {

                    let nuovadata = new Date()
                    let giorno = nuovadata.getDate()
                    let mese = nuovadata.getMonth() + 1
                    let anno = nuovadata.getFullYear()

                    obj.datafuorigioco = giorno + "/" + mese + "/" + anno

                    if (Object.keys(plrlist).length > index + 1) { //controllo la fine della classifica
                        obj.posizione = posp1 + 1 // scendo di 1 perchè ho annullato

                    }
                    //  }
                    console.log("pod do chi sta in fuorigioco:" + obj.posizione)
                    updateUserPosition(obj)

                } if (index + 1 === posp1 + 1) {

                    obj.posizione = obj.posizione - 1 // sale di uno quello sotto
                    if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
                    console.log("sale di uno quello sotto al fuorigioco", obj.posizione)
                    updateUserPosition(obj)

                }


            })

        });
    }

    function penalizzazionePending(idp1, idp2) {

        fetch(window.$produrl + "/user?role=player&codiceclub=" + club, {
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

            let classicica = resp;

            let posp1 = 0
            let posp2 = 0

            const cercapos1 = classicica.filter(obj => {

                if (obj.id === idp1) {

                    posp1 = obj.posizione;
                }
                return posp1

            })
            const cercapos2 = classicica.filter(obj => {

                if (obj.id === idp2) {

                    posp2 = obj.posizione;
                }
                return posp2

            })


            console.log(posp1);
            console.log(posp2);

            const foundannulla = classicica.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((obj, index) => {

                if (index + 1 === posp2 + 1) {

                    if (obj.id !== idp1) {

                        obj.posizione = obj.posizione - 1 // sale di uno quello sotto

                        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 

                        console.log("sale di uno quello sotto al player2: " + obj.name + " - ", obj.posizione)
                        updateUserPosition(obj)
                    } else {
                        obj.posizione = obj.posizione - 1 // sale di uno quello sotto

                        console.log("becca player2: " + obj.name + " - ", obj.posizione)

                        obj.insfida = false;
                        updateUserPosition(obj)
                    }
                }
                else if (obj.id === idp2) {

                    obj.insfida = false;
                    if (Object.keys(classicica).length > index + 1) { //controllo la fine della classifica
                        obj.posizione = obj.posizione + 1 // scendo di 1 perchè ho annullato

                        console.log("id chi anulla:" + obj.id)
                        console.log("posizione iniz:" + posp2)
                        console.log("pod do chi anulla:" + obj.posizione)
                    }

                    updateUserPosition(obj)

                }

            })

            let classificatemp = classicica

            const foundannullaC2 = classificatemp.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((object, coda) => {

                if (coda + 1 === posp1 - 1) {

                    if (object.id !== idp2) {

                        object.posizione = object.posizione + 1 // scende di uno quello sopra
                        console.log("scendi uno quello sopra al player1: " + object.name + " - ", object.posizione)
                        updateUserPosition(object)
                    } else {
                        object.posizione = object.posizione + 1 // scende di uno quello sopra

                        console.log("becca player1: " + object.name + " - ", object.posizione)
                        object.insfida = false;
                        updateUserPosition(object)
                    }
                }

                if (object.id === idp1) {

                    object.insfida = false;
                    object.posizione = object.posizione - 1  // sale di uno subisce annullo

                    if (object.posizione <= 0) { object.posizione = 1 }  //check primo classifica 

                    console.log("id chi subisce anullo:" + object.id)
                    console.log("posizione iniz:" + posp1)
                    console.log("sale di uno subisce annullo", object.posizione)
                    updateUserPosition(object)
                }
            })

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
        <div>
            {showmenu &&
                <div className="header">


                    <span style={{ marginTop:'3px', float: 'left' }}><i>{sessionStorage.getItem('fullname')} - {sessionStorage.getItem('clubname')}</i> 
                    </span>
                    {badge === true && <span className="badge">News</span>}
                    <span>  <Link className="logout" style={{ float: 'right', color: '#013777 !important' }} to={'/logout'}>
                    <FaIcons.FaSignOutAlt style={{color: '#013777' }} /></Link> </span>
                </div>
            }
        </div>
    );
}

export default Appheader;