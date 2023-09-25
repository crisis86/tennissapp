import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React from "react";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/it' // load on demand

const Mychallenge = () => {

    const navigate = useNavigate();
    const customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.locale('it')
    dayjs.extend(customParseFormat)

    const iduser = parseInt(sessionStorage.getItem('iduser'))
    const fullname = sessionStorage.getItem('fullname')
    const [challengepending, setchallengepending] = useState([]);
    const [flagmeplayer, setflagmeplayer] = useState([]);
    const [player, setplayer] = useState([]);
    const [classicica, setclassifica] = useState([]);
    const [datadellasfida, setdatadellasfida] = useState(new Date())
    const [orasfida, setordasfida] = useState("")
    const [today, setday] = useState(new Date())
    const locale = 'it';

    const [set1casa, setset1casa] = useState(0)
    const [set1ospite, setset1ospite] = useState(0)

    const [set2casa, setset2casa] = useState(0)
    const [set2ospite, setset2ospite] = useState(0)

    const [set3casa, setset3casa] = useState(0)
    const [set3ospite, setset3ospite] = useState(0)


    useEffect(() => {
   
        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else {

            fetchdata();
            checksfidapending();

            // SwitchCase("Sfidato", 17 ,11) 
        }

    }, []);

    async function fetchdata() {

        try {

            const results = await Promise.all(
                [

                    fetch(window.$produrl + "/user?id=" + iduser).then((response) =>
                        response.json()),
                    fetch(window.$produrl + "/user?insfida=true").then((response) =>
                        response.json()),
                    fetch(window.$produrl + "/user?role=player").then((response) =>
                        response.json()

                    ),
                ]);


            setflagmeplayer(results[0]);
            setplayer(results[1]);
            setclassifica(results[2]);

        } catch (error) {
            console.error(error);
        }
    }

    const progmatchandle = (e, idrecord) => {
        e.preventDefault();
        //   console.log(datadellasfida)
        //  const formatted = Intl.DateTimeFormat(locale).format(datadellasfida); // 3/19/2023
        const formatted = dayjs(datadellasfida).format('DD/MM/YYYY')
        Swal.fire({
            title: 'Sei sicuro?',
            text: 'Vuoi programmare la sfida?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f47f35',
            confirmButtonText: 'Si sono sicuro!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Sfida Programmata!',
                    'con su successo!'
                )

                const found = challengepending.filter(obj => {

                    obj.datasfida = formatted;
                    obj.orasfida = orasfida;

                    return obj.id === idrecord
                });

                //  console.log(challengepending)
                //  console.log(found)

                fetch(window.$produrl + "/challenge/" + idrecord, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(found[0])
                }).then((result) => {
                    //  console.log(result)
                    result.json().then((resp) => {

                        fetchdata();
                        checksfidapending();

                    })
                }).catch((err) => {
                    toast.error(err.message);
                });

            }
        })

    }

    function calcolavincitore() {

        let player1 = 0
        let player2 = 0

        if (set1casa > set1ospite) {
            player1 += 1
        } else if (player1 < player2) {
            player2 += 1
        }
        if (set2casa > set2ospite) {
            player1 += 1
        } else if (player1 < player2) {
            player2 += 1
        }
        if (set3casa > set3ospite) {
            player1 += 1
        } else if (player1 < player2) {
            player2 += 1
        }
        if (player1 > player2) {
            return "Player1"
        } else if (player1 < player2) {
            return "Player2"
        } else {
            return "Pareggio" // non dovrebbe succedere
        }

    }
    function IsValidate(s1c, s1o, s2c, s2o, s3c, s3o) {
        let isproceed = true;
        let errormessage = 'errore ';


        if (s1c === null || s1c === '' || parseInt(s1c) < 0) {
            isproceed = false;
            errormessage += 'inserire un risultato valido';

        }
        if (s2c === null || s2c === '' || parseInt(s2c) < 0) {
            isproceed = false;
            errormessage += 'inserire un risultato valido';

        }
        if (s3c === null || s3c === '' || parseInt(s3c) < 0) {
            isproceed = false;
            errormessage += 'inserire un risultato valido';

        }

        if (s1o === null || s1o === '' || parseInt(s1o) < 0) {
            isproceed = false;
            errormessage += 'inserire un risultato valido';

        }
        if (s2o === null || s2o === '' || parseInt(s2o) < 0) {
            isproceed = false;
            errormessage += 'inserire un risultato valido';

        }
        if (s3o === null || s3o === '' || parseInt(s3o) < 0) {
            isproceed = false;
            errormessage += 'inserire un risultato valido';

        }

        if (s1c === 0 && s1o === 0) {
            isproceed = false;
            errormessage += ' Set1 0-0 Non valido';
        } else if (s1c === '0' && s1o === '0') {
            isproceed = false;
            errormessage += ' Set1 0-0 Non valido';
        }

        if (!isproceed) {
            toast.warning(errormessage)
        }
        console.log(isproceed)
        return isproceed;
    }

    const aggiornapunteggio = (e, idrecord, p1, p2) => {
        e.preventDefault();

        Swal.fire({
            title: 'Sei sicuro?',
            text: 'Vuoi aggiornare il risultato?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#71b852',
            cancelButtonColor: '#f47f35',
            confirmButtonText: 'Operazione irreversibile!'
        }).then((result) => {

            if (IsValidate(set1casa, set1ospite, set2casa, set2ospite, set3casa, set3ospite)) {

                if (result.isConfirmed) {
                    Swal.fire(
                        'Sfida Completata!',
                        'il risultato è stato aggiornato!'
                    )
                    let player1 = 0;
                    let player2 = 0;
                    //  const play = player.map(obj => obj.posizione) 
                    let vincitore = calcolavincitore()

                    const found = challengepending.filter(obj => {
                        if (obj.id === idrecord) {

                            obj.set1 = set1casa + '-' + set1ospite
                            obj.set2 = set2casa + '-' + set2ospite
                            obj.set3 = set3casa + '-' + set3ospite
                            obj.status = "complete"

                            player1 = obj.players[0].idp1
                            player2 = obj.players[1].idp2
                            if (vincitore === "Player1") {
                                
                                obj.finalplayer = obj.players[0].idp1;
                            } else {
                                obj.finalplayer = obj.players[1].idp2;

                            }
                        }
                        return obj.id === idrecord
                    });

                    //    console.log(challengepending)
                    //   console.log(found[0])

                    fetch(window.$produrl + "/challenge/" + idrecord, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(found[0])
                    }).then((result) => {
                        //  console.log(result)
                        result.json().then((resp) => {


                          //  let vincitore = calcolavincitore()
                            // console.log('sono il vincitore:' +vincitore)

                            // rettifico classifica
                            if (vincitore === "Player1") {

                                SwitchCase('Sfida', player1, player2)
                            } else {
                                SwitchCase('Sfidato', player1, player2)
                            }

                            sessionStorage.setItem('stoinsfida', false); // pulisco la session flag sfida
                            checksfidapending();

                        })
                    }).catch((err) => {
                        toast.error(err.message);
                    });

                }
            }
        })

    }

    const accettasfidahandle = (e, idrecord, status) => {
        e.preventDefault();

        // console.log(idrecord)
        //  console.log(status)

        let mtext = "Vuoi lanciare la sfida?";
        let mconfirmtext = "Si, invia la sfida";
        if (status === 'accept') {
            mtext = "Vuoi Accettare la sfida?";
            mconfirmtext = "Si, accetta la sfida!";
        }

        Swal.fire({
            title: 'Sei sicuro?',
            text: mtext,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: mconfirmtext
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Sfida Confermata!',
                    'con su successo!'
                )


                let player = 0;
                let datiemail = "";

                const found = challengepending.filter(obj => {
                    if (obj.id === idrecord) {
                        obj.status = 'processing';

                        player = obj.players[0].idp1
                    }
                    return obj.id === idrecord
                });

                datiemail = loademailsend(player);
                let datisplit = datiemail.split('#')

                //    console.log(challengepending)
                //   console.log(found[0])

                fetch(window.$produrl + "/challenge/" + idrecord, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(found[0])
                }).then((result) => {
                    //  console.log(result)
                    result.json().then((resp) => {

                        sendemail(datisplit[0], datisplit[1], 'add')
                        fetchdata();
                        checksfidapending();

                    })
                }).catch((err) => {
                    toast.error(err.message);
                });

            }
        })


    }

    const sfidahandle = (e, idp1, status, idchallange) => {
        e.preventDefault();

        //    loadlistplayer(idp1);

        let mtext = "Vuoi lanciare la sfida?";
        let mconfirmtext = "Si, invia la sfida";
        if (status === 'cancel') {
            mtext = "annullando perderai UNA posizione in classifica!";
            mconfirmtext = "Si, annulla la sfida!";
        }

        Swal.fire({
            title: 'Sei sicuro?',
            text: mtext,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: mconfirmtext
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Confermato!',
                    'con su successo!'
                )

                let emailsfindate = ""
                let nomesfidate = ""

                const found = player.filter(obj => {
                    return obj.id === idp1;
                });

                const found2 = found.filter(obj => {

                    if (obj.id === idp1 && status === "update") {
                        obj.insfida = true;
                        emailsfindate = obj.email
                        nomesfidate = obj.name
                    } else {
                        obj.insfida = false;
                        emailsfindate = obj.email
                        nomesfidate = obj.name
                    }

                    return obj.id === idp1;
                });

                fetch(window.$produrl + "/user/" + idp1, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(found2[0])
                }).then((result) => {
                    //   console.log(result)
                    result.json().then((resp) => {

                        sendemail(nomesfidate, emailsfindate, 'remove')

                        flagmesfida(status);

                        removechallenge(idchallange);

                        checksfidapending();

                    })
                }).catch((err) => {
                    toast.error(err.message);
                });

            }
        })

    }

    function flagmesfida(status) {

        const found = flagmeplayer.filter(obj => {
            if (obj.id === iduser && status === "update") {
                obj.insfida = true;

            } else if (obj.id === iduser && status === "cancel") {
                obj.insfida = false;
                //     obj.posizione = obj.posizione - 1;
            }
            return obj.id === iduser;
        });
        //  console.log(found);

        fetch(window.$produrl + "/user/" + iduser, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(found[0])
        }).then((result) => {
            //  console.log(result)
            result.json().then((resp) => {
                if (status === 'update') {
                    toast.success('Sfida inviata');
                } else {
                    toast.error('Sfida Annullata');
                }

            })
        }).catch((err) => {
            toast.error(err.message);
        });

    }


    const checksfidapending = () => {


        fetch(window.$produrl + "/challenge?status!=cancel&q=" + fullname).then(res => {
            if (!res.ok) {
                // console.log('nulla')
                return false
            }
            return res.json();
        }).then(resp => {
            if (Object.keys(resp).length === 0) {
                toast.error('Nessuna Sfida');
            } else {
                setchallengepending(resp);
                // console.log(resp[0].datasfida);
            }
        }).catch((err) => {
            toast.error('checksfidapending failerd to :' + err.message);
        });

    }

    function removechallenge(idrecord) {

        let player1 = 0
        let player2 = 0
        let idriga = 0;

        const current = new Date();
        const datecancel = dayjs(current).format('DD/MM/YYYY')

        const found = challengepending.filter(obj => {

            if (obj.id === idrecord) {
                obj.status = "cancel";
                obj.datasfida = datecancel;
                obj.finalplayer= iduser
                idriga = obj.id;

                player1 = obj.players[0].idp1
                player2 = obj.players[1].idp2
            }
            return obj.id;

        })
        if (idriga > 0) {
            console.log(idriga);

            fetch(window.$produrl + "/challenge/" + idriga, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(found[0])
            }).then((result) => {
                //  console.log(result)
                result.json().then((resp) => {
                    //  console.log(resp)

                    if (player1 === iduser) {
                        SwitchCase('Annulla_sfida', player1, player2)

                    } else {
                        SwitchCase('Annulla_sfida', player2, player1)
                    }

                    sessionStorage.setItem('stoinsfida', false);
                    //  setstoinsifa(false);
                })
            }).catch((err) => {
                toast.error(err.message);
            });


        } else {
            toast.error('idriga: ' + idriga);
        }

        checksfidapending();

    }

    function loadnumberphone(idacercare) {

        let telefono = ""

        const found = player.filter(obj => {

            if (obj.id === idacercare) {

                telefono = "Contatto: " + obj.phone;
            }
            return obj.id === idacercare

        })


        return telefono
    }

    function loademailsend(idacercare) {

        let emailsend = ""
        let nomesend = ""

        const found = player.filter(obj => {

            if (obj.id === idacercare) {
                nomesend = obj.name;
                emailsend = obj.email;
            }
            return obj.id === idacercare

        })


        return nomesend + "#" + emailsend
    }

    function SwitchCase(props, idp1, idp2) {

        sessionStorage.setItem('stoinsfida', false);

        /// recupero posizioni attuali
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

        switch (props) {
            case 'Sfida':

                //let indice = posp1 - posp2

                const found = classicica.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((obj, index) => {

                    if (index + 1 >= posp2 && index + 1 <= posp1 - 1) {

                        if (Object.keys(classicica).length > index + 1) {

                            obj.posizione = obj.posizione + 1
                            if (obj.id === idp1) { obj.insfida = false; } // ulteriore controllo dello sfidato 
                            if (obj.id === idp2) { obj.insfida = false; } // ulteriore controllo dello sfidato 
                            console.log("Posizioni nel mezzo: " + obj.posizione)
                            updateUserPosition(obj)
                        }

                    }
                    if (obj.id === idp2) {
                        obj.insfida = false
                        if (Object.keys(classicica).length > index + 1) {
                            obj.insfida = false
                            obj.posizione = posp2 + 1 // scendo di una posizione 
                            console.log("posizione pedente:" + obj.posizione)
                        }
                        updateUserPosition(obj)
                    } if (obj.id === idp1) {

                        obj.insfida = false
                        obj.posizione = posp2 // prendo la posizione di chi o sfidato salgo in classifica
                        console.log("pos vincente", obj.posizione)
                        updateUserPosition(obj)
                    }
                    return obj.id

                })

                //  console.log(JSON.stringify(found));
                return found

            case 'Sfidato':


                const found2 = classicica.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((obj, index) => {

                    let vecchiapos = ""
                    if (index + 1 === posp2 - 1 || index + 1 === posp2 - 2) {

                        if (posp2 === 2) { return } // esco perchè rimango al secondo posto
                        if (posp2 === 3 && obj.posizione === 1) { return } // esco per non cambiare la posizione al numero1

                        if (obj.id !== idp1 || obj.id !== idp2)
                            vecchiapos = obj.posizione
                        obj.posizione = obj.posizione + 1

                        console.log("ho spostato id  " + obj.name + " vecchia pos:" + vecchiapos)
                        console.log("Posizioni nel mezzo:" + obj.posizione)
                        updateUserPosition(obj)
                    }
                    if (obj.id === idp2) {
                        obj.insfida = false
                        obj.posizione = posp2 - 2 // Salgo di 2 posizioni

                        //  if (obj.posizione <= 0) { obj.posizione = 2; indicep=0 }  //check sedondo classifica divento >1 
                        if (obj.posizione <= 1) { obj.posizione = 2; }  //check primo classifica se ero 3 divento 1
                        if (posp2 === 1) { obj.posizione = 1; } // check se sono primo resto primo

                        console.log("posizione vincente:" + obj.posizione)
                        updateUserPosition(obj)

                    }

                    if (obj.id === idp1) {

                        obj.insfida = false

                        if (Object.keys(classicica).length > index + 1) { //controllo la fine della classifica
                            vecchiapos = obj.posizione
                            obj.posizione = obj.posizione + 1 // scendo di una
                            console.log("Pedendte " + obj.name + " vecchia pos:" + vecchiapos)
                            console.log("pos perdente", obj.posizione)
                        }
                        console.log("lunghezza array perd ", Object.keys(classicica).length)
                        console.log("lunghezza perd", index)

                        updateUserPosition(obj)

                    }

                    if (index + 1 === posp1 + 1) {
                        obj.posizione = obj.posizione - 1  // sale di uno quello sotto a me

                        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
                        console.log("lunghezza indice poss che deve salire ", index)
                        console.log("pos che sale sotto al perdente", obj.posizione + " " + obj.name)
                        updateUserPosition(obj)
                    }

                    return obj.id

                })

                //    console.log(JSON.stringify(found2));

                return found2

            case 'Annulla_sfida':

                const foundannulla = classicica.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((obj, index) => {

                    if (obj.id === idp1) {

                        obj.insfida = false;
                        if (Object.keys(classicica).length > index + 1) { //controllo la fine della classifica
                            obj.posizione = obj.posizione + 1 // scendo di 1 perchè ho annullato

                            console.log("id chi anulla:" + obj.id)
                            console.log("posizione iniz:" + posp1)
                            console.log("pod do chi anulla:" + obj.posizione)
                        }

                        updateUserPosition(obj)

                    }

                    if (index + 1 === posp1 + 1) {

                        if (obj.id !== idp2) {

                            obj.posizione = obj.posizione - 1 // sale di uno quello sotto

                            if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 

                            console.log("sale di uno quello sotto", obj.posizione)
                            updateUserPosition(obj)
                        }
                    }

                    if (obj.id === idp2) {

                        obj.insfida = false;
                        obj.posizione = obj.posizione - 1  // sale di uno subisce annullo

                        if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 

                        console.log("id chi subisce anullo:" + obj.id)
                        console.log("posizione iniz:" + posp2)
                        console.log("sale di uno subisce annullo", obj.posizione)
                        updateUserPosition(obj)
                    }

                    if (index + 1 === posp2 - 1) {

                        if (obj.id !== idp1) {

                            obj.posizione = obj.posizione + 1 // scende di uno quello sopra
                            console.log("scendi uno quello sopra", obj.posizione)
                            updateUserPosition(obj)
                        }
                    }

                    return obj.id

                })
                return foundannulla;


            case 'Annullo_forzato':
                const foundannullaforzato = classicica.sort((a, b) => a.posizione > b.posizione ? 1 : -1).filter((obj, index) => {

                    if (obj.id === idp1) {

                        obj.insfida = false;
                        if (Object.keys(classicica).length > index + 1) { //controllo la fine della classifica
                            obj.posizione = posp1 + 1 // scendo di 1 perchè ho annullato
                        }
                        console.log("pod do chi anulla:" + obj.posizione)
                        updateUserPosition(obj)

                    } if (index + 1 === posp1 + 1) {
                        if (obj.id !== idp2) {
                            obj.posizione = obj.posizione - 1 // sale di uno quello sotto
                            if (obj.posizione <= 0) { obj.posizione = 1 }  //check primo classifica 
                            console.log("sale di uno quello sotto", obj.posizione)
                            updateUserPosition(obj)
                        }

                    } if (obj.id === idp2) {

                        obj.insfida = false;
                        if (Object.keys(classicica).length > index + 1) { //controllo la fine della classifica
                            obj.posizione = posp2 + 1  // scendo di 1 perchè ho annullato
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
                        }
                    }

                })
                return foundannullaforzato;

            default:
                return '';
        }
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
                console.log(resp)

            })
        }).catch((err) => {
            toast.error(err.message);
        });
    }

    function sendemail(names, emails, status) {

        let message = "";
        let subject = "";
        if (status === 'add') {
            message = "Ciao " + names + ", \n\n" +
                "Sfida accettata da " + fullname + " \n" +
                "Controlla Le tue Sfide cliccando sul link https://tennissapp.vercel.app/Mychallenge \n per accettare o rifiutare la sfida \n\n" +
                "Questa email è stata inviata da SpinupTennis"
            subject = "Sfida accettata da " + fullname

        } else {
            message = "Ciao " + names + ", \n\n" +
                "Il giocatore " + fullname + " ha non accetato la sfida \n" +
                "Controlla Le tue Sfide cliccando sul link https://tennissapp.vercel.app/Mychallenge \n\n" +
                "Questa email è stata inviata da SpinupTennis"
            subject = "Sfida annullata " + fullname
        }

        let data = {
            //metto volutamente  il subject nella voce name
            name: subject,
            email: emails,
            message: message
        }
        // console.log(data);
        fetch(window.$servEmail + "/send", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {

            toast.success("Message Sent.");

        }).catch((err) => {
            toast.error(err + " Message failed to send.")
        });

    }

    function formatdate(data) {

        let formattedDate = dayjs().format(data) // 2023-03-01
        //   console.log(formattedDate)
        return formattedDate
    }
    return (
        <>
            <div className="page-content">
                <div className="left">
                    <a href="/ChallengeList" className="link back">
                        <i className="icon icon-back"></i>
                        <span className="if-not-md">Back</span>
                    </a>
                </div>

                <div className="">
                    <div style={{ textAlign: "center", background: "#060b26", opacity: 0.8, color: 'white', fontSize: "20px" }} className="title">Ultime Sfide

                    </div>
                    {challengepending &&

                        challengepending.sort((a, b) => a.id < b.id ? 1 : -1).map((item, index) => (
                            <div key={index + 1} style={{ paddingLeft: '5px' }} className="card no-shadow no-safe-area-left">


                                <div className="card-contet">
                                    <div className="block block-strong medium-hide no-hairlines no-margin-vertical sticky sticky-top">

                                        <div style={{ padding: '5px 8px' }} className={item.status === 'pending' || item.status === 'processing' ? 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong-pending' : 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong'}>

                                            <ul>

                                                <li style={{ textTransform: 'capitalize' }} key={index + 1}>{item.players[0].p1} VS {item.players[1].p2}</li>
                                                {item.status === 'pending' &&
                                                    <b>Attesa Avversario</b>

                                                }
                                                {item.status === 'processing' &&
                                                    <>
                                                        {item.datasfida === '' ? (
                                                            <b>Da Porgrammare</b>

                                                        ) : (
                                                            <b>In Corso</b>

                                                        )}
                                                    </>
                                                }
                                                {item.status === 'cancel' &&
                                                    <b>Annullata</b>

                                                }
                                                {item.status === 'complete' &&
                                                    <b>Completata </b>

                                                }
                                                <li><b> Creata:</b> {item.datacreate} <b>{item.status==='cancel' ? 'Annullata: ' : 'Prevista: '}</b> {item.datasfida} {item.orasfida} </li>
                                                {item.players[0].idp1 === iduser ? (
                                                    <li> <b> {loadnumberphone(item.players[1].idp2)}</b></li>
                                                ) : (
                                                    <li> <b>{loadnumberphone(item.players[0].idp1)}</b></li>    
                                                )}
                                                <li ><b>Score</b></li>
                                                <li style={{ textDecoration: item.set1 === '0-0' ? 'line-through' : 'none' }} >Set1: <b>{item.set1} </b></li>
                                                <li style={{ textDecoration: item.set2 === '0-0' ? 'line-through' : 'none' }} >Set2: <b>{item.set2} </b></li>
                                                <li style={{ textDecoration: item.set3 === '0-0' ? 'line-through' : 'none' }} >Set3: <b>{item.set3} </b> </li>

                                            </ul>

                                        </div>



                                    </div>
                                </div>

                                <div>
                                    {item.players[0].idp1 === iduser ? (
                                        <div className="col flex-shrink-0">
                                            <div className="row">
                                                <div className="col-100 small-50">
                                                    {item.status === 'pending' &&
                                                        <button onClick={(e) => sfidahandle(e, item.players[1].idp2, 'cancel', item.id)} type="button" className="button button-fill color-red">Annulla </button>

                                                    }

                                                </div>
                                                {item.status === 'processing' &&
                                                    <>
                                                        {item.datasfida === '' ? (
                                                            <div className="row">
                                                                <b>Programma La sfida</b>

                                                                <div>
                                                                    <Calendar minDate={new Date()}
                                                                        formatday={(locale, date) => dayjs(date).format('DD/MM/YYYY')}
                                                                        onChange={date => setdatadellasfida(date)} value={datadellasfida} />

                                                                    <b>Orario</b>:<select style={{ maxWidth: '36%', marginBottom:'5px' }} value={orasfida} onChange={e => setordasfida((e.target.value))} className="list form-control">
                                                                        <option value="09.00">09.00</option>
                                                                        <option value="09.30">09.30</option>
                                                                        <option value="10.30">10.00</option>
                                                                        <option value="10.30">10.30</option>
                                                                        <option value="11.00">11.00</option>
                                                                        <option value="11.30">11.30</option>
                                                                        <option value="12.00">12.00</option>
                                                                        <option value="12.30">12.30</option>
                                                                        <option value="13.00">13.00</option>
                                                                        <option value="13.30">13.30</option>
                                                                        <option value="14.00">14.00</option>
                                                                        <option value="14.30">14.30</option>
                                                                        <option value="15.00">15.00</option>
                                                                        <option value="15.30">15.30</option>
                                                                        <option value="16.00">16.00</option>
                                                                        <option value="16.30">16.30</option>
                                                                        <option value="17.00">17.00</option>
                                                                        <option value="17.30">17.30</option>
                                                                        <option value="18.00">18.00</option>
                                                                        <option value="18.30">18.30</option>
                                                                        <option value="19.00">19.00</option>
                                                                        <option value="19.30">19.30</option>
                                                                        <option value="20.00">20.00</option>
                                                                        <option value="20.30">20.30</option>
                                                                        <option value="21.00">21.00</option>
                                                                        <option value="21.30">21.30</option>
                                                                        <option value="22.00">22.00</option>
                                                                        <option value="22.30">22.30</option>
                                                                        <option value="23.00">23.00</option>
                                                                        <option value="23.30">20.30</option>

                                                                    </select>

                                                                    <button onClick={(e) => progmatchandle(e, item.id)} type="button" className="button button-fill button-small">Conferma data</button>
                                                                    &nbsp;
                                                                    {item.datasfida === '' ? (
                                                                        <button onClick={(e) => sfidahandle(e, item.players[1].idp2, 'cancel', item.id)} type="button" className="button button-fill color-red">Annulla </button>
                                                                    ) : (
                                                                        <>
                                                                            {dayjs(today).format('DD/MM/YYYY') < formatdate(item.datasfida) &&

                                                                                <button onClick={(e) => sfidahandle(e, item.players[1].idp2, 'cancel', item.id)} type="button" className="button button-fill color-red">Annulla </button>
                                                                            }
                                                                        </>
                                                                    )}


                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="row">

                                                                {/*  {Date(today) >= Date(item.datasfida) && */}

                                                                {dayjs(today).format('DD/MM/YYYY') >= formatdate(item.datasfida) &&

                                                                    <div>

                                                                        <span><i>Inserisci Il risultati </i></span>

                                                                        <table className="data-table">
                                                                            <tbody>
                                                                                <tr index={index + 1}>
                                                                                    <td>Set 1</td>
                                                                                    <td>
                                                                                        <input type="number" min="1" max="100" value={set1casa} onChange={e => setset1casa(e.target.value)} className="form-control"></input>
                                                                                    </td>
                                                                                    <td>-</td>
                                                                                    <td>
                                                                                        <input type="number" min="1" max="100" value={set1ospite} onChange={e => setset1ospite(e.target.value)} className="form-control"></input>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Set 2</td>
                                                                                    <td>
                                                                                        <input type="number" min="1" max="100" value={set2casa} onChange={e => setset2casa(e.target.value)} className="form-control"></input>
                                                                                    </td>
                                                                                    <td>-</td>
                                                                                    <td>
                                                                                        <input type="number" min="1" max="100" value={set2ospite} onChange={e => setset2ospite(e.target.value)} className="form-control"></input>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Set 3</td>
                                                                                    <td>
                                                                                        <input type="number" min="1" max="100" value={set3casa} onChange={e => setset3casa(e.target.value)} className="form-control"></input>
                                                                                    </td>
                                                                                    <td>-</td>
                                                                                    <td>
                                                                                        <input type="number" min="1" max="100" value={set3ospite} onChange={e => setset3ospite(e.target.value)} className="form-control"></input>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>

                                                                        <button style={{ display: 'inerith' }} onClick={(e) => aggiornapunteggio(e, item.id, item.players[0].idp1, item.players[1].idp2)} type="button" className="button button-fill button-small">Aggiorna Risultati</button>

                                                                    </div>
                                                                }
                                                            </div>
                                                        )}
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col flex-shrink-0">

                                            <div className="row">
                                                {item.status === 'pending' && item.datasfida === '' &&
                                                    <>
                                                        <div className="col-100 small-50">
                                                            <button onClick={(e) => sfidahandle(e, item.players[0].idp1, 'cancel', item.id)} type="button" className="button button-fill color-red">Annulla</button>
                                                        </div>&nbsp;
                                                        <div className="col-100 small-50">
                                                            <button onClick={(e) => accettasfidahandle(e, item.id, 'accept')} type="button" className="button button-fill button-small">Accetta</button>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            {item.status === 'processing' &&
                                                <>
                                                    {item.datasfida === '' ? (
                                                        <div className="row">
                                                            <b> Programma La sfida</b>

                                                            <div>
                                                                <Calendar minDate={new Date()}
                                                                    formatday={(locale, date) => dayjs(date).format('DD/MM/YYYY')}
                                                                    onChange={date => setdatadellasfida(date)} value={datadellasfida} />

                                                                <b>Orario</b>:<select style={{ maxWidth: '36%', marginBottom:'5px' }} value={orasfida} onChange={e => setordasfida((e.target.value))} className="list form-control">
                                                                    <option value="09.00">09.00</option>
                                                                    <option value="09.30">09.30</option>
                                                                    <option value="10.30">10.00</option>
                                                                    <option value="10.30">10.30</option>
                                                                    <option value="11.00">11.00</option>
                                                                    <option value="11.30">11.30</option>
                                                                    <option value="12.00">12.00</option>
                                                                    <option value="12.30">12.30</option>
                                                                    <option value="13.00">13.00</option>
                                                                    <option value="13.30">13.30</option>
                                                                    <option value="14.00">14.00</option>
                                                                    <option value="14.30">14.30</option>
                                                                    <option value="15.00">15.00</option>
                                                                    <option value="15.30">15.30</option>
                                                                    <option value="16.00">16.00</option>
                                                                    <option value="16.30">16.30</option>
                                                                    <option value="17.00">17.00</option>
                                                                    <option value="17.30">17.30</option>
                                                                    <option value="18.00">18.00</option>
                                                                    <option value="18.30">18.30</option>
                                                                    <option value="19.00">19.00</option>
                                                                    <option value="19.30">19.30</option>
                                                                    <option value="20.00">20.00</option>
                                                                    <option value="20.30">20.30</option>
                                                                    <option value="21.00">21.00</option>
                                                                    <option value="21.30">21.30</option>
                                                                    <option value="22.00">22.00</option>
                                                                    <option value="22.30">22.30</option>
                                                                    <option value="23.00">23.00</option>
                                                                    <option value="23.30">20.30</option>

                                                                </select>

                                                                <button onClick={(e) => progmatchandle(e, item.id)} type="button" className="button button-fill button-small">Conferma data</button>
                                                                &nbsp;
                                                                {item.datasfida === '' ? (
                                                                    <button onClick={(e) => sfidahandle(e, item.players[0].idp1, 'cancel', item.id)} type="button" className="button button-fill color-red">Annulla</button>
                                                                ) : (
                                                                    <>
                                                                        {dayjs(today).format('DD/MM/YYYY') < formatdate(item.datasfida) &&

                                                                            <button onClick={(e) => sfidahandle(e, item.players[0].idp1, 'cancel', item.id)} type="button" className="button button-fill color-red">Annulla</button>
                                                                        }
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="row">
                                                            <>
                                                            </>
                                                            {dayjs(today).format('DD/MM/YYYY') >= formatdate(item.datasfida) &&

                                                                /*   {Date(today) >= Date(item.datasfida) &&
       */
                                                                <div>

                                                                    <span><i>Inserisci Il risultati</i></span>

                                                                    <table className="data-table">
                                                                        <tbody>
                                                                            <tr index={index + 1}>
                                                                                <td>Set 1</td>
                                                                                <td>
                                                                                    <input type="number" min="1" max="100" value={set1casa} onChange={e => setset1casa(e.target.value)} className="form-control"></input>
                                                                                </td>
                                                                                <td>-</td>
                                                                                <td>
                                                                                    <input type="number" min="1" max="100" value={set1ospite} onChange={e => setset1ospite(e.target.value)} className="form-control"></input>
                                                                                </td>


                                                                            </tr>

                                                                            <tr>
                                                                                <td>Set 2</td>
                                                                                <td>
                                                                                    <input type="number" min="1" max="100" value={set2casa} onChange={e => setset2casa(e.target.value)} className="form-control"></input>
                                                                                </td>
                                                                                <td>-</td>
                                                                                <td>
                                                                                    <input type="number" min="1" max="100" value={set2ospite} onChange={e => setset2ospite(e.target.value)} className="form-control"></input>
                                                                                </td>


                                                                            </tr>

                                                                            <tr>
                                                                                <td>Set 3</td>
                                                                                <td>
                                                                                    <input type="number" min="1" max="100" value={set3casa} onChange={e => setset3casa(e.target.value)} className="form-control"></input>
                                                                                </td>
                                                                                <td>-</td>
                                                                                <td>
                                                                                    <input type="number" min="1" max="100" value={set3ospite} onChange={e => setset3ospite(e.target.value)} className="form-control"></input>
                                                                                </td>


                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <button style={{ display: 'inerith' }} onClick={(e) => aggiornapunteggio(e, item.id, item.players[0].idp1, item.players[1].idp2)} type="button" className="button button-fill button-small">Aggiorna Risultati</button>

                                                                </div>

                                                            }


                                                        </div>
                                                    )}
                                                </>
                                            }
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                </div>
            </div>

        </>

    );
}


export default Mychallenge;
