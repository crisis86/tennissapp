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

            if (sessionStorage.getItem('iduser') > 0) {
                eseguiControlli();
            }

            const cron = require('node-schedule')
            cron.scheduleJob('*/180 * * * *', () => {

                // controllasfide()
                //  controllpending();
                //  controllafuorigioco()

                console.log('running a task every 1min', new Date());
            });
        }
    }, [])

    async function eseguiControlli() {
        try {
            await controllasfide();
            await controllpending();
            await controllafuorigioco();
            await checkAndFixPositions()
        } catch (error) {
            console.error("Errore durante l'esecuzione dei controlli:", error);
        }
    }


    useEffect(() => {


        //  let count = parseInt(sessionStorage.getItem("onlineUsers") || "0", 10);
        //  count += 1;
        //  sessionStorage.setItem("onlineUsers", count);
        //  setcount(count);


        if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/Regolamento.html' || location.pathname === '/Presentation.html') {
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



    async function controllasfide() {

        try {
            const response = await fetch(`${window.$produrl}/challenge?status=processing&codiceclub=${club}`, {
                method: 'GET',
                headers: { accept: 'application/json' }
            });

            if (!response.ok) return;  //  Evita di eseguire altro se la risposta non è valida

            let challenger = await response.json();  //  Attendi il parsing del JSON
            const current = new Date();

            for (let obj of challenger) {  //  Usa un ciclo `for...of` per iterare sugli oggetti
                if (!obj.datasfida) {
                    let splidate = obj.datacreate.split("/");
                    let dataconvert = new Date(`${splidate[2]}/${splidate[1]}/${splidate[0]}`);
                    const days = Math.ceil(Math.abs(dataconvert - current) / (1000 * 60 * 60 * 24));

                    if (days > 2) {
                        console.log(`Sfida scaduta tra ${obj.players[0].p1} VS ${obj.players[1].p2}`);

                        let giorno = String(current.getDate()).padStart(2, '0');
                        let mese = String(current.getMonth() + 1).padStart(2, '0');
                        let anno = current.getFullYear();

                        obj.status = 'cancel';
                        obj.datasfida = `${giorno}/${mese}/${anno}`;

                        await cancelchallenge(obj, obj.id);  // ⏳ Attendi che la PUT sia completata
                        await penalizzazione(obj.players[0].idp1, obj.players[1].idp2);
                    }
                }
            }
        } catch (error) {
            console.error("Errore in controllasfide:", error);
        }
    }


    async function controllpending() {

        try {
            const response = await fetch(`${window.$produrl}/challenge?status=pending&codiceclub=${club}`, {
                method: 'GET',
                headers: { accept: 'application/json' }
            });

            if (!response.ok) return;

            let challenger = await response.json();
            const current = new Date();

            for (let obj of challenger) {
                if (!obj.datasfida) {
                    let splidate = obj.datacreate.split("/");
                    let dataconvert = new Date(`${splidate[2]}/${splidate[1]}/${splidate[0]}`);
                    const days = Math.ceil(Math.abs(dataconvert - current) / (1000 * 60 * 60 * 24));

                    if (days > 2) {
                        console.log(`Sfida scaduta tra ${obj.players[0].p1} VS ${obj.players[1].p2}`);

                        let giorno = String(current.getDate()).padStart(2, '0');
                        let mese = String(current.getMonth() + 1).padStart(2, '0');
                        let anno = current.getFullYear();

                        obj.status = 'cancel';
                        obj.datasfida = `${giorno}/${mese}/${anno}`;
                        obj.finalplayer = null;

                        await cancelchallenge(obj, obj.id);
                        await penalizzazionePending(obj.players[0].idp1, obj.players[1].idp2);
                    }
                }
            }
        } catch (error) {
            console.error("Errore in controllpending:", error);
        }
    }

    async function controllafuorigioco() {
        try {
            const response = await fetch(`${window.$produrl}/user?role=player&fuorigioco=true&codiceclub=${club}`, {
                method: 'GET',
                headers: { accept: 'application/json' }
            });

            if (!response.ok) {
                console.error('Errore durante la fetch dei giocatori in fuorigioco.');
                return false;
            }

            const userfuorigioco = await response.json();
            console.log(userfuorigioco);

            const current = new Date();

            for (let obj of userfuorigioco) {  // ✨ Sostituisce il `filter` con un ciclo `for...of`
                console.log(current);
                if (obj.datafuorigioco !== '' || obj.datafuorigioco !== null) {
                    let fuoridata = obj.datafuorigioco;
                    let splidate = fuoridata.split("/");
                    let dataconvert = new Date(`${splidate[2]}/${splidate[1]}/${splidate[0]}`);

                    console.log(fuoridata);
                    console.log(dataconvert);

                    const time = Math.abs(dataconvert - current);
                    const days = Math.ceil(time / (1000 * 60 * 60 * 24));

                    console.log(days);

                    if (days >= 6) {
                        console.log('Fuorigioco >= di 6 giorni');
                        await penalizzazionesingola(obj.id);  // ✅ Ora `await` funziona correttamente
                        console.log('penalizzo:', obj.name);
                    } else {
                        console.log('Fuorigioco dentro i 6 giorni');
                    }
                } else {
                    console.log('Nessuna data da fuorigioco da controllare');
                }
            }
        } catch (error) {
            console.error('Errore in controllafuorigioco:', error);
        }
    }

    async function cancelchallenge(objchallenge, idriga) {

        try {
            const response = await fetch(`${window.$produrl}/challenge/${idriga}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objchallenge)
            });

            const result = await response.json();
            console.log(`Challenge in status cancel: ${objchallenge.id}`);
        } catch (error) {
            console.error("Errore in cancelchallenge:", error);
        }

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
                    console.log(obj.name + " posiz do chi anulla:" + obj.posizione)
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
                    //    if (obj.posizione !== 1) {


                    if (Object.keys(plrlist).length > index + 1) { //controllo la fine della classifica
                        obj.posizione = posp2 + 1  // scendo di 1 perchè ho annullato

                    }
                    //  }

                    console.log(obj.name + "annullamento: sale di uno quelle sotto", obj.posizione)
                    updateUserPosition(obj)

                }
                if (index + 1 === posp2 + 1) {
                    if (obj.id !== idp1) {
                        obj.posizione = obj.posizione - 1 // sale di uno quello sotto

                        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
                        console.log(obj.name + "annullamento: scende di uno quelle sopra", obj.posizione)
                        updateUserPosition(obj)
                    } else {
                        obj.insfida = false;
                        updateUserPosition(obj)
                    }
                }

            })

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
                    let giorno = String(nuovadata.getDate()).padStart(2, '0'); // Aggiunge lo 0 se serve
                    let mese = String(nuovadata.getMonth() + 1).padStart(2, '0'); // Aggiunge lo 0 se serve
                    let anno = nuovadata.getFullYear()

                    obj.datafuorigioco = giorno + "/" + mese + "/" + anno

                    if (Object.keys(plrlist).length > index + 1) { //controllo la fine della classifica
                        obj.posizione = posp1 + 1 // scendo di 1 perchè ho annullato

                    }
                    //  }
                    console.log(obj.name + " pod do chi sta in fuorigioco: " + obj.posizione)
                    updateUserPosition(obj)

                } if (index + 1 === posp1 + 1) {

                    obj.posizione = obj.posizione - 1 // sale di uno quello sotto
                    if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
                    console.log(obj.name + " sale di uno quello sotto al fuorigioco", obj.posizione)
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
                console.log(ogettogioc.name + " Classifica aggiornata iduser: ", ogettogioc.id)
              
            })
        }).catch((err) => {
            console.log(err.message);
        });
    }

    async function checkAndFixPositions() {
        try {
            const response = await fetch(`${window.$produrl}/user?role=player&codiceclub=${club}`, {
                method: 'GET',
                headers: { accept: 'application/json' }
            });

            if (!response.ok) {
                console.error('Errore durante la fetch dei giocatori.');
                return false;
            }

            const players = await response.json();

            // Ordina i giocatori per posizione crescente
            players.sort((a, b) => a.posizione - b.posizione);

            let previousPosition = 0; // Memorizza la posizione precedente per confrontare
            let updatesNeeded = [];

            for (let player of players) {
                if (player.posizione !== previousPosition + 1) {
                    // La posizione non è consecutiva, correggila
                    console.log(`Correzione necessaria: ${player.name}, posizione attuale: ${player.posizione}, posizione corretta: ${previousPosition + 1}`);

                    player.posizione = previousPosition + 1;
                    updatesNeeded.push(player);  // Aggiungi il giocatore alla lista per l'aggiornamento
                }
                previousPosition = player.posizione; // Aggiorna la posizione precedente
            }

            // Esegui gli aggiornamenti per tutti i giocatori che necessitano di correzione
            for (let player of updatesNeeded) {
                await updateUserPosition(player);
                console.log(`Posizione aggiornata per ${player.name}: ${player.posizione}`);
            }

            if (updatesNeeded.length === 0) {


                console.log("Tutte le posizioni sono corrette.");
            }
        } catch (error) {

            console.error('Errore in checkAndFixPositions:', error);
        }
    }

    return (
        <div>
            {showmenu &&
                <div className="header">


                    <div style={{ marginTop: '3px', float: 'left' }}><i>{sessionStorage.getItem('fullname')} - {sessionStorage.getItem('clubname')}</i>
                    </div>
                    {badge === true && <span className="badge">News</span>}
                    <span>  <Link className="logout" style={{ float: 'right', color: '#013777 !important' }} to={'/logout'}>
                        <FaIcons.FaSignOutAlt style={{ color: '#013777' }} /></Link> </span>
                </div>
            }
        </div>
    );
}

export default Appheader;