import { useState, useEffect } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
import avatar from './assets/avatar.png';
import Report from './hooks/Report';
import dayjs from 'dayjs';
import 'dayjs/locale/it' // load on demand


const ChallengeSingle = () => {
    const customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.locale('it')
    dayjs.extend(customParseFormat)

    const season = true
    //id user collegato
    const iduser = parseInt(sessionStorage.getItem('iduser'));
    //nome user collegato
    const fullname = sessionStorage.getItem('fullname');
    // dati utente collegato
    const datiuserloging = JSON.parse(localStorage.getItem('datiuserlogin'));
    const miaposizione = parseInt(datiuserloging.posizione);
    // oggetto giocatore 
    const [player, setplayer] = useState([]);
    // oggetto user collegato
    const [flagmeplayer, setflagmeplayer] = useState([]);
    //elenco sfide giocatore 
    const [challenge, setchallenge] = useState([]);
    // sfida pendign giocatore
    const [challengepending, setchallengepending] = useState([]);
    const [datadioggi, setdatadioggi] = useState(new Date());
    const [giornisfida, setgiornisfida] = useState(0);

    // flag SFIDA user collegato
    // const [stoinsfida, setstoinsifa] = useState(sessionStorage.getItem('stoinsfida'));
    //flag annulla bottone
    const [annullabotton, setannullabotton] = useState(false);
    // flag per sfidare se è possibile
    const [sfidabutton, setsfidabutton] = useState(false);
    const club = sessionStorage.getItem('club');

    const { id, name } = useParams()

    const navigate = useNavigate();

    useEffect(() => {

        if (club === "" || club === undefined) {
            navigate('/login');
        }



        let email = sessionStorage.getItem('email')


        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else {
            fetchdata();
            //   SfidaAbilitata();
            getlastsfidacomplete();

            checksfidapending();
            //   sendemail('test', 'crisisart86@gmail.com','test test test');
        }
    }, []);

    async function fetchdata() {

        try {

            const results = await Promise.all(
                [
                    fetch(window.$produrl + "/user?role=player&id=" + id + "&codiceclub=" + club).then((response) =>
                        response.json()),
                    fetch(window.$produrl + "/user?id=" + iduser + "&codiceclub=" + club).then((response) =>
                        response.json()),
                    fetch(window.$produrl + '/challenge?q=' + name + '&status!=cancel&codiceclub=' + club).then((response) =>
                        response.json()
                    ),
                ]);
            setplayer(results[0]);

            setflagmeplayer(results[1]);

            setchallenge(results[2]);

        } catch (error) {
            console.error(error);
        }
    }

    const sfidahandle = (e, idp1, idname1, status) => {

        e.preventDefault();

        let mtext = "Vuoi lanciare la sfida?";
        let mconfirmtext = "Si, invia la sfida";
        if (status === 'cancel') {
            mtext = "annullando perderai 1 posizione in classifica!";
            mconfirmtext = "Si, annulla la sfida!";
        }

        Swal.fire({
            title: 'Sei sicuro?',
            text: mtext,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#afb72f',
            cancelButtonColor: '#dc513b',
            confirmButtonText: mconfirmtext
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Confermato!',
                    'con su successo!'
                )

                let mailforsend = "";

                const found = player.filter(obj => {
                    if (obj.id === idp1 && status === "update") {
                        obj.insfida = true;
                        mailforsend = obj.email
                    } else {
                        obj.insfida = false;
                        mailforsend = obj.email
                    }
                    return obj.id === idp1;
                });

                fetch(window.$produrl + "/user/" + idp1, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(found[0])
                }).then((result) => {
                    //  console.log(result)
                    result.json().then((resp) => {

                        flagmesfida(status);

                        if (status === 'update') {
                            addchallenge(idp1, idname1, mailforsend);

                        } else {
                            removechallenge(idname1);
                        }

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
                obj.fuorigioco = false;

            } else if (obj.id === iduser && status === "cancel") {
                obj.insfida = false;
                //  obj.posizione = obj.posizione - 2;
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

    function addchallenge(iddasfidare, nomedasfidare, emailperinvio) {

        const current = new Date();

        const date = dayjs(current).format('DD/MM/YYYY')
        //const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
        // console.log(date);
        const obj = {
            "datacreate": date,
            "datasfida": "",
            "orasfida": "",
            "players": [
                {
                    "idp1": iduser,
                    "p1": fullname
                },
                {
                    "idp2": iddasfidare,
                    "p2": nomedasfidare,
                }
            ],
            "status": 'pending',
            "set1": "",
            "set2": "",
            "set3": "",
            "finalplayer": null,
            "codiceclub": club
        }
        //  console.log(obj);

        fetch(window.$produrl + "/challenge", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(obj)
        }).then((res) => {
            console.log('challenge creato')
            sessionStorage.setItem('stoinsfida', true);

            sendemail(nomedasfidare, emailperinvio, 'add')

            // console.log('sto in sfida: ' +stoinsfida)
        }).catch((err) => {
            toast.error('addchallenge :' + err.message);
        });

        fetchdata();
        checksfidapending();

    }

    function sendemail(names, emails, status) {

        if (window.$produrl === "http://localhost:10000") { return }

        let message = "";
        let subject = "";
        if (status === 'add') {
            message = "Ciao " + names + ", \n\n" +
                "Sei stato Sfidato ad " + fullname + " \n" +
                "Controlla Le tue Sfide cliccando sul link https://tennissapp.vercel.app/Mychallenge \n per accettare o rifiutare la sfida \n\n" +
                "Questa email è stata inviata da SpinupTennis"
            subject = "Nuova Sfida da " + fullname
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


    function removechallenge(nomegiocatore1) {

        const current = new Date();
        const datecancel = dayjs(current).format('DD/MM/YYYY')
        let idriga = 0;

        const found = challengepending.filter(obj => {

            obj.status = "cancel";
            obj.datasfida = datecancel;
            idriga = obj.id;

            return obj.id;

        })
        if (idriga > 0) {
            // console.log(idriga);

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
                    sessionStorage.setItem('stoinsfida', false);

                })
            }).catch((err) => {
                toast.error(err.message);
            });

            checksfidapending();
            fetchdata();

        } else {
            toast.error('idriga: ' + idriga);
        }
    }

    const getlastsfidacomplete = () => {

        let sfidecoolete = {};

        fetch(window.$produrl + "/challenge?status=complete&codiceclub=" + club + "&q=" + fullname, {
            method: 'GET'
        }).then(res => {
            if (!res.ok) {
                // console.log('nulla')
                return false
            }
            return res.json();
        }).then(res => {
            if (Object.keys(res).length > 0) {
                sfidecoolete = res;

                // datalastfida = Math.max(...sfidecoolete.map(o => o.datasfida))

                let recorddatalastfida = sfidecoolete.sort((a, b) => a.id < b.id ? 1 : -1)[0]

                console.log(recorddatalastfida.datasfida)

                let splidate = recorddatalastfida.datasfida.split("/")
                let dataconvert = new Date(splidate[2] + "/" + splidate[1] + "/" + splidate[0])

                console.log(datadioggi)
                console.log(dataconvert)

                const time = Math.abs(dataconvert - datadioggi);
                const days = Math.ceil(time / (1000 * 60 * 60 * 24));
                let notificagioni = 0;
                console.log(days);

                if (days === 1) { notificagioni = 2 } else if (days === 2) { notificagioni = 1 }

                if (days > 2) {
                    console.log("> = di 2 days")

                    setsfidabutton(true)
                    getlastsfidaCancel()
                } else {
                    console.log("minore di 2 days " + recorddatalastfida.players[0].idp1)
                    if (recorddatalastfida.players[0].idp1 === iduser) {
                        console.log("sono io blocca")
                        setsfidabutton(false)
                        setgiornisfida(parseInt(notificagioni));
                    } else {
                        setsfidabutton(true)
                        getlastsfidaCancel()
                        console.log("non sono io")
                    }


                }
            } else {
                setsfidabutton(true)
                getlastsfidaCancel()

                console.log("vuoto nessuna sfida complete")
            }
        });
    }


    const getlastsfidaCancel = () => {

        let sfidecoolete = {};
        // let datalastfida = new Date();

        fetch(window.$produrl + "/challenge?status=cancel&codiceclub=" + club + "&finalplayer=" + iduser, {
            method: 'GET'
        }).then(res => {
            if (!res.ok) {
                // console.log('nulla')
                return false
            }
            return res.json();
        }).then(res => {
            if (Object.keys(res).length > 0) {
                sfidecoolete = res;

                // datalastfida = Math.max(...sfidecoolete.map(o => o.datasfida))

                let recorddatalastfida = sfidecoolete.sort((a, b) => a.id < b.id ? 1 : -1)[0]

                let splidate = recorddatalastfida.datasfida.split("/")
                let dataconvert = new Date(splidate[2] + "/" + splidate[1] + "/" + splidate[0])

                //   console.log(datadioggi.getDate())
                //  console.log(dataconvert.getDate())

                const time = Math.abs(dataconvert - datadioggi);
                const days = Math.ceil(time / (1000 * 60 * 60 * 24));
                let notificagioni = 0;
                console.log(days);

                if (days === 1) { notificagioni = 2 } else if (days === 2) { notificagioni = 1 }


                if (days > 2) {
                    console.log("> = di 2 days")

                    setsfidabutton(true)

                } else {
                    console.log("minore di 2 days " + recorddatalastfida.players[0].idp1)
                    if (recorddatalastfida.players[0].idp1 === iduser) {
                        console.log("sono io blocca")
                        setsfidabutton(false)
                        setgiornisfida(notificagioni);
                    } else {
                        setsfidabutton(true)
                        console.log("non sono io")
                    }


                }
            } else {
                setsfidabutton(true)
                console.log("vuoto nessuna sfida cancel")
            }
        });
    }

    const checksfidapending = () => {

        fetch(window.$produrl + "/challenge?status=pending&codiceclub=" + club + "&q=" + name).then(res => {
            return res.json();
        }).then(resp => {
            if (Object.keys(resp).length === 0) {

                // toast.success('nessuna Challenge pending da mostare')
            } else {
                setchallengepending(resp);


                // console.log(iduser)
                if (resp[0].players[0].idp1 === iduser || resp[0].players[1].idp2 === iduser) {

                    setannullabotton(true);

                } else {
                    setannullabotton(false);
                }

            }

        }).catch((err) => {
            toast.error('checksfidapending failerd to :' + err.message);
        });

    }


    return (
        <>
            <div className="page-content">
                <div style={{ textAlign: "center" }} className="title"><h1>Scheda Giocatore </h1>
                </div>
                <hr></hr>
                <div className="">
                    {player &&
                        player.map((plr, index) => (
                            <div key={index + 1} className="row">
                                <div className="col flex-shrink-0 width-auto">

                                    <img className="shape-rounded-square" src={avatar} loading="lazy" height="48" width="48" alt="" />

                                    <div style={{ float: 'right' }}>

                                        <Report name={plr.name} id={plr.id} view="single" />

                                    </div>

                                </div>


                                <div className="col flex-grow-1 margin-right-half">
                                    <div className="multi-line-text lines-2">
                                        <b style={{color: 'rgb(175, 183, 47)'}} className="icon material-icons tooltip-init" data-tooltip="Verified">Posizione:{plr.posizione}</b>


                                        <span className="font-size-22 font-weight-bold vertical-align-middle name"></span>
                                    </div>

                                    <div style={{ fontWeight: '600' }} className="font-size-14 single-line-text text-color-gray">{plr.name}</div>
                                    <div className="font-size-22 font-weight-bold vertical-align-middle name">{plr.address}</div>

                                    {plr.fuorigioco &&
                                        <div className="font-size-14 single-line-text text-color-red"><b>FUORIGIOCO</b>
                                            <br></br>
                                            Dal: <i> {plr.datafuorigioco} </i>
                                        </div>
                                    }
                                    {plr.insfida &&
                                        <div className="font-size-14 single-line-text text-color-red"><b>NON SFIDABILE</b></div>
                                    }
                                </div>


                                <div className="left">
                                    <a href="/ChallengeList" className="link back">
                                        <i className="icon icon-back"></i>
                                        <span className="if-not-md">Back</span>
                                    </a>

                                </div>

                                <div className="col flex-grow-1 margin-right-half">
                                    {plr.id !== iduser &&
                                        <div className="row">

                                            {plr.insfida ? (
                                                <div className="col-100 small-50">
                                                    {annullabotton &&
                                                        <button style={{ display: 'none' }} onClick={(e) => sfidahandle(e, plr.id, plr.name, 'cancel')} type="button" className="button button-fill color-red">Annulla</button>
                                                    }
                                                </div>
                                            ) : (

                                                <div className="col-100 small-50">

                                                    {sfidabutton ? (
                                                        <>
                                                            {plr.posizione > flagmeplayer[0].posizione || flagmeplayer[0].posizione <= plr.posizione + 8 &&  // fino a 8 posizione sopra
                                                                <>
                                                                    {plr.fuorigioco === false &&
                                                                        <button style={{ width: '50%', margin: '4px auto', background: '#d3e742', color: '#137000', fontWeight: '600', padding: '3px' }} disabled={plr.insfida || flagmeplayer[0].insfida} onClick={(e) => sfidahandle(e, plr.id, plr.name, 'update')} type="button" className={plr.insfida || flagmeplayer[0].insfida ? 'disabled button button-fill button-small' : 'button button-fill button-small'}>Sfida</button>
                                                                    }
                                                                </>
                                                            }
                                                        </>
                                                    ) : (
                                                        <div style={{ textAlign: 'center', margin: '0 auto' }}><span style={{ background: '#e7e7e7', padding: '5px', color: '#ff3b30' }}> Giorni di Attesa per la prossima sfida: <b>{giornisfida}</b></span></div>
                                                    )}

                                                </div>

                                            )}

                                        </div>
                                    }
                                </div>

                                <span className="segmented-highlight"></span>

                                <div style={{ textAlign: "center", background: "#013777", opacity: 1, color: 'white', fontSize: "20px" }} className="title">Ultime Sfide

                                </div>
                                {challenge.sort((a, b) => a.id < b.id ? 1 : -1).map((partite, i) => (
                                    <div key={i + 1} style={{ paddingLeft: '5px', border: '0', marginBottom: '0' }} className="card no-shadow no-safe-area-left">
                                        <div style={{ marginRight: '14px' }} className="card-contet">
                                            <div className="block block-strong medium-hide no-hairlines no-margin-vertical sticky sticky-top">
                                                <div style={{ padding: '5px 8px' }} className={partite.status === 'pending' || partite.status === 'processing' ? 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong-pending' : 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong'}>

                                                    <ul>

                                                        <li style={{ textAlign: 'center' }}>
                                                            {partite.status === 'pending' &&
                                                                <b> <i>  EV. {partite.id} </i>-   Attesa Avversario</b>

                                                            }
                                                            {partite.status === 'processing' &&
                                                                <>
                                                                    {partite.datasfida === '' ? (
                                                                        <b> <i>  EV. {partite.id} </i>- Da Porgrammare</b>

                                                                    ) : (
                                                                        <b> <i>  EV. {partite.id} </i>- In Corso</b>

                                                                    )}
                                                                </>
                                                            }
                                                            {partite.status === 'cancel' &&
                                                                <>
                                                                    <b> <i>  EV. {partite.id} </i>-  Annullata da:</b>


                                                                    {partite.finalplayer != null &&
                                                                        <>
                                                                            {partite.finalplayer === partite.players[0].idp1 ? (
                                                                                <i style={{ color: '#dc513b' }}>  {partite.players[0].p1} </i>

                                                                            ) : (
                                                                                <i style={{ color: '#dc513b' }}>  {partite.players[1].p2} </i>

                                                                            )}
                                                                        </>
                                                                    }


                                                                </>

                                                            }
                                                            {partite.status === 'complete' &&
                                                                <b> <i>  EV. {partite.id} </i>-  Completata </b>

                                                            }
                                                        </li>
                                                        <li style={{ textAlign: 'center' }}>     <b> Del: </b>{partite.datacreate}
                                                            <b>{partite.status === 'cancel' ? ' Annullata: ' : ' Prevista: '}</b> {partite.datasfida} {partite.orasfida}</li>
                                                        <li style={{ textTransform: 'capitalize', textAlign: 'center', color: '#013777', textDecoration: 'underline' }}><div style={{fontWeight: partite.finalplayer===partite.players[0].idp1 ? 'bold' : '200'}}>{partite.players[0].p1}</div> VS <div style={{fontWeight: partite.finalplayer===partite.players[1].idp2 ? 'bold' : '200'}}>{partite.players[1].p2}</div></li>
                                                        <li style={{ textAlign: 'center' }} ><b>Score</b></li>
                                                        <li style={{ textAlign: 'center', textDecoration: partite.set1 === '0-0' ? 'line-through' : 'none' }}>Set1: <b>{partite.set1} </b></li>
                                                        <li style={{ textAlign: 'center', textDecoration: partite.set2 === '0-0' ? 'line-through' : 'none' }}>Set2: <b>{partite.set2} </b></li>
                                                        <li style={{ textAlign: 'center', textDecoration: partite.set3 === '0-0' ? 'line-through' : 'none' }}>Set3: <b>{partite.set3} </b> </li>
                                                    </ul>

                                                </div>

                                                {/*    <span className="segmented-highlight"></span> */}

                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ))}


                </div>
            </div>

        </>
    );
}

export default ChallengeSingle
