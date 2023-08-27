import { useState, useEffect } from "react";
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";


const ChallengeSingle = () => {

    //id user collegato
    const iduser = parseInt(sessionStorage.getItem('iduser'));
    //nome user collegato
    const fullname = sessionStorage.getItem('fullname');
    // dati utente collegato
    const datiuserloging= JSON.parse(localStorage.getItem('datiuserlogin'));
    const miaposizione = parseInt(datiuserloging.posizione);
    // oggetto giocatore 
    const [player, setplayer] = useState([]);
    // oggetto user collegato
    const [flagmeplayer, setflagmeplayer] = useState([]);
    //elenco sfide giocatore 
    const [challenge, setchallenge] = useState([]);
    // sfida pendign giocatore
    const [challengepending, setchallengepending] = useState([]);

    // flag SFIDA user collegato
    const [stoinsfida, setstoinsifa] = useState(sessionStorage.getItem('stoinsfida'));
    //flag annulla bottone
    const [annullabotton, setannullabotton ] = useState(false);
    // flag per sfidare se è possibile
    const [sfidabutton, setsfidabutton] = useState(false);
  

    const idplayer = useParams();

    //const location = useLocation()
    //const { test } = location.state

    useEffect(() => {
        fetchdata();
     //   SfidaAbilitata();
       checksfidapending();
      

    }, []);

    async function fetchdata() {


        try {

          
            const results = await Promise.all(
                [
                    fetch("http://localhost:10000/user?role=player&name=" + idplayer['name']).then((response) =>
                        response.json()),
                    fetch("http://localhost:10000/user?id=" + iduser).then((response) =>
                        response.json()),
                    fetch('http://localhost:10000/challenge?q=' + idplayer['name'] + '&status!=cancel').then((response) =>
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
    const sfidahandle = (e, idp1, status) => {

        e.preventDefault();

        let mtext = "Vuoi lanciare la sfida?";
        let mconfirmtext = "Si, invia la sfida";
        if (status === 'cancel') {
            mtext = "annullando perderai 2 punti in classifica!";
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


                fetch("http://localhost:10000/user/" + idp1, {
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
                            addchallenge(idp1);

                        } else {
                            removechallenge();
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

        fetch("http://localhost:10000/user/" + iduser, {
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

    function addchallenge(iddasfidare) {

        const current = new Date();
        const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;
        // console.log(date);
        const obj = {
            "datasfida": date,
            "players": [
                {
                "idp1":iduser,    
                "p1": fullname
                },
                {
               "idp2":iddasfidare,  
                "p2": idplayer['name']
                }
            ],
            "status": 'pending',
            "set1": "",
            "set2": "",
            "set3": "",
            "set4": "",
            "set5": ""
        }
        console.log(obj);

        fetch("http://localhost:10000/challenge", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(obj)
        }).then((res) => {
            console.log('challenge creato')
            sessionStorage.setItem('stoinsfida', true);
                setstoinsifa(true);
            // console.log('sto in sfida: ' +stoinsfida)
        }).catch((err) => {
            toast.error('addchallenge :' + err.message);
        });

        //usenavigate('/Mychallenge')
        fetchdata();
        checksfidapending();

    }

    function removechallenge() {

        let idriga = 0;

        const found = challengepending.filter(obj => {

            obj.status = "cancel";
            idriga = obj.id;

            return obj.id;
           
        })
        if (idriga > 0) {
            console.log(idriga);

            fetch("http://localhost:10000/challenge/" + idriga, {
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
                    setstoinsifa(false);
                })
            }).catch((err) => {
                toast.error(err.message);
            });

            fetchdata();

        } else {
            toast.error('idriga: ' + idriga);
        }
    }
    const checksfidapending = () => {

        fetch("http://localhost:10000/challenge?status=pending&q="+idplayer['name']).then(res => {
            return res.json();
        }).then(resp => {
            if (Object.keys(resp).length === 0) {
             toast.success('nessuna Challenge pending da mostare')
            } else {
                console.log(resp)
                setchallengepending(resp);

                console.log(iduser)
                if (resp[0].players[0].idp1 === iduser || resp[0].players[1].idp2 === iduser ) {
                       
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
            <div className="page">
                <div className="left">
                    <a href="/ChallengeList" className="link back">
                        <i className="icon icon-back"></i>
                        <span className="if-not-md">Back</span>
                    </a>
                </div>
                <div className="title">Scheda Giocatore </div>
                <div className="page-content">
                    {player &&
                        player.map((plr, index) => (
                            <div key={index + 1} className="row">
                                <div className="col flex-shrink-0 width-auto">
                                    <img className="shape-rounded-square" src="https://source.unsplash.com/bYODySpLIhE/128x128" loading="lazy" height="84" width="84" alt="" />
                                </div>

                                <div className="col flex-grow-1 margin-right-half">
                                    <div className="multi-line-text lines-2">
                                        <i className="icon material-icons color-green tooltip-init" data-tooltip="Verified">Posizione:{plr.posizione}</i>

                                        <span className="font-size-22 font-weight-bold vertical-align-middle name"></span>
                                    </div>
                                    <div className="font-size-14 single-line-text text-color-gray">{plr.name}</div>
                                </div>
                                <div className="col flex-shrink-0">
                                {plr.id !== iduser && 
                                    <div className="row">

                                        {plr.insfida  ? (
                                            <div className="col-100 small-50">
                                               {annullabotton &&
                                                <button onClick={(e) => sfidahandle(e, plr.id, 'cancel')} type="button" className="button button-fade button-small">Annulla</button>
                                               }
                                                </div>
                                        ) : (
                                           
                                            <div className="col-100 small-50">
                                                 {miaposizione < plr.posizione + 8 &&
                                                <button disabled={stoinsfida === 'true'} onClick={(e) => sfidahandle(e, plr.id, 'update')} type="button" className={stoinsfida=== 'true' ? 'disabled button button-fill button-small' : 'button button-fill button-small'}>Sfida</button>
                                              }
                                            </div>
                                            
                                        )}

                                    </div>
                                }
                                </div>
                                {challenge.sort((a, b) => a.id < b.id ? 1 : -1).map((partite, i) => (
                                
                                    <div key={i + 1} className="block block-strong medium-hide no-hairlines no-margin-vertical sticky sticky-top">
                                        <div className={partite.status==='pending' || partite.status==='processing' ? 'segmented segmented-strong-penging':'segmented segmented-strong'}>

                                            <ul className="">

                                                <li>Sfida: {partite.players[0].p1} VS {partite.players[1].p2}</li>
                                                <li> in data {partite.datasfida}</li>
                                                <li>Stato: {partite.status} </li>
                                                <li>Set1: {partite.set1} </li>
                                                <li>Set2: {partite.set2} </li>
                                                <li>Set3: {partite.set3} </li>
                                                <li>Set4: {partite.set4} </li>
                                                <li>Set5: {partite.set5} </li>

                                            </ul>

                                        </div>

                                        <span className="segmented-highlight"></span>


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
