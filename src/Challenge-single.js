import { useState, useEffect } from "react";
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
import avatar from './assets/avatar.png';
import pallina from './assets/pallina.png';


const ChallengeSingle = () => {

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
    const [sfidabottone, setsfidabottone] = useState(true);
    // flag per sfidare se è possibile
    const [sfidabutton, setsfidabutton] = useState(false);

    const { id, name } = useParams()

    const navigate = useNavigate();

    useEffect(() => {

        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else {
            fetchdata();
            //   SfidaAbilitata();
            getlastsfidacomplete();
            checksfidapending();

        }




    }, []);

    async function fetchdata() {


        try {


            const results = await Promise.all(
                [
                    fetch(window.$produrl + "/user?role=player&id=" + id).then((response) =>
                        response.json()),
                    fetch(window.$produrl + "/user?id=" + iduser).then((response) =>
                        response.json()),
                    fetch(window.$produrl + '/challenge?q=' + name + '&status!=cancel').then((response) =>
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


    function SfidaAbilitata() {

        const pos = player.map(obj => obj.posizione)

        console.log(player.map(obj => obj.posizione));
        console.log(pos);
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: mconfirmtext
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Confermato!',
                    'con su successo!'
                )


                const found = player.filter(obj => {
                    if (obj.id === idp1 && status === "update") {
                        obj.insfida = true;

                    } else {
                        obj.insfida = false;

                        obj.posizione = obj.posizione + 1;
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
                            addchallenge(idp1, idname1);


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

            } else if (obj.id === iduser && status === "cancel") {
                obj.insfida = false;
                obj.posizione = obj.posizione - 2;
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

    function addchallenge(iddasfidare, nomedasfidare) {

        const current = new Date();
        const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;
        // console.log(date);
        const obj = {
            "datacreate": date,
            "datasfida": "",
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
            "set3": ""
        }
        //  console.log(obj);

        fetch(window.$produrl + "/challenge", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(obj)
        }).then((res) => {
            console.log('challenge creato')
            sessionStorage.setItem('stoinsfida', true);
            //    setstoinsifasetstoinsifa(true);
            // console.log('sto in sfida: ' +stoinsfida)
        }).catch((err) => {
            toast.error('addchallenge :' + err.message);
        });

        //usenavigate('/Mychallenge')

        fetchdata();
        checksfidapending();



    }

    function removechallenge(nomegiocatore1) {

        let idriga = 0;

        const current = new Date();
        const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;

        const found = challengepending.filter(obj => {

            obj.status = "cancel";
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
                    // setstoinsifa(false);
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
        // let datalastfida = new Date();

        fetch(window.$produrl + "/challenge?status=complete&q=" + fullname, {
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

            let recorddatalastfida = sfidecoolete.sort((a, b) => a.datasfida > b.datasfida ? 1 : -1)[0]

              let splidate = recorddatalastfida.datasfida.split("/")
              let dataconvert = new Date(splidate[2] + "/" + splidate[1] + "/" + splidate[0])

            // To calculate the time difference of two dates
          //  let Difference_In_Time = datadioggi.getTime() - dataconvert.getTime();
            // To calculate the no. of days between two dates
           // let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            console.log(datadioggi.getDate())
            console.log(dataconvert.getDate())

            //   const Daysfida = datalastfida.getDate();
            const time = Math.abs(datadioggi - dataconvert);
            const days = Math.ceil(time / (1000 * 60 * 60 * 24));
            console.log(days);

 
            if (days > 2) {
                console.log("> = di 2 days")

                 setsfidabutton(true)
            } else {
                console.log("minore di 2 days " + recorddatalastfida.players[0].idp1)
                if(recorddatalastfida.players[0].idp1 === iduser) {
                    console.log("sono io blocca")
                    setsfidabutton(false)
                    setgiornisfida(days);
                }else {
                    setsfidabutton(true )
                    console.log("non sono io")
                }
            
          
            }
        } else {
            setsfidabutton(true)
            console.log("vuoto")
        }
        });
    }

    const checksfidapending = () => {

        fetch(window.$produrl + "/challenge?status=pending&q=" + name).then(res => {
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
                                </div>

                                <div className="col flex-grow-1 margin-right-half">
                                    <div className="multi-line-text lines-2">
                                        <i className="icon material-icons color-green tooltip-init" data-tooltip="Verified">Posizione:{plr.posizione}</i>


                                        <span className="font-size-22 font-weight-bold vertical-align-middle name"></span>
                                    </div>

                                    <div className="font-size-14 single-line-text text-color-gray">{plr.name}</div>
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
                                                        {plr.posizione > miaposizione || miaposizione <= plr.posizione + 8 &&  // fino a 8 posizione sopra

                                                            <button disabled={plr.insfida === 'true'} onClick={(e) => sfidahandle(e, plr.id, plr.name, 'update')} type="button" className={plr.insfida === 'true' ? 'disabled button button-fill button-small' : 'button button-fill button-small'}>Sfida</button>

                                                        }
                                                    </>
                                            ):(
                                                   <div style={{textAlign:'center',margin:'0 auto'}}>Giorni restanti per sfidare: {giornisfida}</div>
                                            )}

                                                </div>

                                            )}

                                        </div>
                                    }
                                </div>

                                <span className="segmented-highlight"></span>

                                <div style={{ textAlign: "center", background: "#060b26", opacity: 0.8, color: 'white', fontSize: "20px" }} className="title">Ultime Sfide

                                </div>
                                {challenge.sort((a, b) => a.id < b.id ? 1 : -1).map((partite, i) => (
                                    <div key={i + 1} style={{ paddingLeft: '5px' }} className="card no-shadow no-safe-area-left">
                                        <div className="card-contet">
                                            <div className="block block-strong medium-hide no-hairlines no-margin-vertical sticky sticky-top">
                                                <div className={partite.status === 'pending' || partite.status === 'processing' ? 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong-pending' : 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong'}>

                                                    <ul>

                                                        <li>Sfida: {partite.players[0].p1} VS {partite.players[1].p2}</li>
                                                        <li>Creata il: {partite.datacreate}</li>
                                                        <li>Programmata il: {partite.datasfida}</li>
                                                        <li>Stato: {partite.status} </li>
                                                        <li ><b>Score</b></li>
                                                        <li >Set1: <b>{partite.set1} </b></li>
                                                        <li >Set2: <b>{partite.set2} </b></li>
                                                        <li >Set3: <b>{partite.set3} </b> </li>
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
