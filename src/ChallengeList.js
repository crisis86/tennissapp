import './assets/framework7-bundle.css';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import iconchallengeblu from './assets/icone/chhallenge-blu.svg';
import iconchallenge from './assets/icone/chhallenge.svg';
import Report from './hooks/Report';

const ChallengeList = () => {
    const navigate = useNavigate();
    const iduser = parseInt(sessionStorage.getItem('iduser'))
    const club = sessionStorage.getItem('club');

    const [playerlist, playerupdt] = useState([]);


    useEffect(() => {

        controllasfide()
        controllpending();
        controllafuorigioco();

        const cron = require('node-schedule')
        cron.scheduleJob('*/10 * * * *', () => {

            controllasfide()
            controllpending();
            controllafuorigioco()
            console.log('running a task every 10min', new Date());
        });


    }, [])


    useEffect(() => {
        if(club==="" || club === undefined){
            navigate('/login');    
        }

        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else {
            loadlistplayer();
        }


    }, []);



    const loadlistplayer = () => {
        fetch(window.$produrl + "/user?role=player&codiceclub="+club).then(res => {
            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(res => {

            let datax = res;
            datax.sort(function (a, b) {
                if (a > b) return 1
                if (b < a) return -1
                return 0
            });

            //console.log(datax);
            playerupdt(datax);
            //console.log(playerupdt);
        });
    }


    function controllasfide() {

        fetch(window.$produrl + "/challenge?status=processing&codiceclub="+club, {
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

                        obj.status = 'cancel';
                        obj.datasfida = obj.datacreate;

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

        fetch(window.$produrl + "/challenge?status=pending&codiceclub="+club, {
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

                        obj.status = 'cancel';
                        obj.datasfida = obj.datacreate;

                        cancelchallenge(obj, obj.id)
                        penalizzazionePending(obj.players[1].idp2, obj.players[0].idp1)

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

        fetch(window.$produrl + "/user?role=player&codiceclub="+club, {
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

        fetch(window.$produrl + "/user?role=player&fuorigioco=true&codiceclub="+club, {
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
                        console.log('Fuorigioco Dentro i 6 girni')
                    }

                } else {
                    console.log('nessuna data da fuorigioco da controllare')
                }
                return obj.id
            });
        });
    }

    function penalizzazionesingola(idp1) {

        fetch(window.$produrl + "/user?role=player&codiceclub="+club, {
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

        fetch(window.$produrl + "/user?role=player&codiceclub="+club, {
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
        <div className="page">
            <div className="tabs-swipeable-wrap">
                <div className="tabs">
                    <div className="page-content tab tab-active">
                        <div className="row justify-content-center">
                            <div style={{ paddingLeft: '0', paddingRight: '0' }} className="col-100 medium-75 large-60 xlarge-50">
                                <div className="list inset margin-vertical">
                                    <ul>
                                        {playerlist &&
                                            playerlist.sort((a, b) => a.posizione > b.posizione ? 1 : -1).map((item, index) => (
                                                <li style={{ borderRadius: '30px' }} key={index + 1} className={item.id === iduser ? 'my-rank me' : 'my-rank'}>
                                                    <div style={{ borderRadius: '30px', background: item.insfida ? 'rgba(244,127,53,1)' : '', fontWeight: item.insfida ? 'bold' : '500' }} className="item-content">
                                                        <div className="item-inner item-cell">
                                                            <div className="item-row">
                                                                <div className="item-cell width-auto">
                                                                    <img src={item.id === iduser ? iconchallengeblu : iconchallenge} height="30" width="30" alt="Challenge" />
                                                                </div>
                                                                <a className='link' style={{ width: '170px' }} href={'/Challenge-single/' + item.id + '/' + item.name}>

                                                                    <div style={{ fontSize: '15px', textTransform: 'capitalize' }} className="item-cell">
                                                                        <div className="font-size-20 font-weight-bold text-color-primary">

                                                                            {item.name}

                                                                        </div>

                                                                        {item.id === iduser ? (
                                                                            <div className="country font-size-14 text-color-gray">{item.country}</div>

                                                                        ) : (
                                                                            <>
                                                                                {item.fuorigioco === false ? (
                                                                                    <div className="country font-size-14 text-color-gray">{item.insfida ? 'Non Sfidabile' : 'Sfidabile'}</div>
                                                                                ) : (
                                                                                    <div className="country font-size-14 text-color-red"><b>FUORIGIOCO</b></div>

                                                                                )}
                                                                            </>
                                                                        )}

                                                                    </div>
                                                                </a>
<Report name={item.name} id={item.id} view="list" ></Report>
                                                                <div className="item-cell flex-shrink-0 width-auto">
                                                                    <div className="classifica font-size-18 font-weight-bold text-color-bluegray">{item.posizione}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChallengeList;