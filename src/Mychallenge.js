import { useState, useEffect } from "react";
import React from "react";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';


const Mychallenge = () => {


    const iduser = parseInt(sessionStorage.getItem('iduser'))
    const fullname = sessionStorage.getItem('fullname')
    const [challengepending, setchallengepending] = useState([]);
    const [flagmeplayer, setflagmeplayer] = useState([]);
    const [player, setplayer] = useState([]);


    useEffect(() => {
        fetchdata();
        checksfidapending();

    }, []);



    async function fetchdata() {


        try {


            const results = await Promise.all(
                [

                    fetch("http://localhost:8000/user?id=" + iduser).then((response) =>
                        response.json()
                    ),
                ]);


            setflagmeplayer(results[0]);



        } catch (error) {
            console.error(error);
        }
    }

    const accettasfidahandle = (e, idrecord, status) => {
        e.preventDefault();

        console.log(idrecord)
        console.log(status)

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

                /* const found = challengepending.find(obj => {
                    obj.status= 'processing';
                    return obj.id === idrecord;
                  }); */

                const found = challengepending.filter(obj => {

                    obj.status = 'processing';

                    return obj.id === idrecord
                });

                console.log(challengepending)
                console.log(found[0])

                fetch("http://localhost:8000/challenge/" + idrecord, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(found[0])
                }).then((result) => {
                    console.log(result)
                    result.json().then((resp) => {

                        checksfidapending();

                    })
                }).catch((err) => {
                    toast.error(err.message);
                });

            }
        })


    }



    const sfidahandle = (e, idp1, status) => {
        e.preventDefault();

        loadlistplayer(idp1);


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



                fetch("http://localhost:8000/user/" + idp1, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(found[0])
                }).then((result) => {
                    console.log(result)
                    result.json().then((resp) => {

                        flagmesfida(status);

                        removechallenge();

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

        fetch("http://localhost:8000/user/" + iduser, {
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


        fetch("http://localhost:8000/challenge?status!=cancel&q=" + fullname).then(res => {
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

                const current = new Date();
                const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;

                /*   const found = challengepending.find(obj => {
                      return obj.datasfida == date;
                    }); */
                console.log(resp[0].datasfida);
                console.log(date);

                if (date !== resp[0].datasfida) {
                    console.log('cancella sfida');



                } else {


                    console.log('in attesa di risposta');
                }
            }
        }).catch((err) => {
            toast.error('checksfidapending failerd to :' + err.message);
        });

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

            fetch("http://localhost:8000/challenge/" + idriga, {
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
                    //      setstoinsifa(false);
                })
            }).catch((err) => {
                toast.error(err.message);
            });


        } else {
            toast.error('idriga: ' + idriga);
        }

        checksfidapending();

    }

    function loadlistplayer(idgiocatore) {
        fetch("http://localhost:8000/user?id=" + idgiocatore).then(res => {
            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(res => {

            setplayer(res);

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
                <div className="title">Le tue Sfide </div>
                <div className="page-content">
                    {challengepending &&
                        challengepending.map((item, index) => (
                            <div key={index + 1} className="row">


                                <div className="col flex-grow-1 margin-right-half">
                                    <div className="block block-strong medium-hide no-hairlines no-margin-vertical sticky sticky-top">
                                        <div className={item.status === 'processing' ? 'segmented segmented-strong-green' : "segmented segmented-strong"} style={{}}>

                                            <ul className="">

                                                <li key={index + 1}>Sfida: {item.players[0].p1} VS {item.players[1].p2}</li>
                                                <li> Stato {item.status}</li>
                                                <li> in data {item.datasfida}</li>
                                                <li>Set1: {item.set1} </li>
                                                <li>Set2: {item.set2} </li>
                                                <li>Set3: {item.set3} </li>
                                                <li>Set4: {item.set4} </li>
                                                <li>Set4: {item.set5} </li>

                                            </ul>

                                        </div>

                                        <span className="segmented-highlight"></span>

                                    </div>
                                </div>

                                <div>
                                    {item.players[0].idp1 === iduser ? (
                                        <div className="col flex-shrink-0">
                                            <div className="row">
                                                <div className="col-100 small-50">
                                                {item.status === 'pending' &&
                                                    <button onClick={(e) => sfidahandle(e, item.players[1].idp2, 'cancel')} type="button" className="button button-fade button-small">Annulla</button>
                                                }
                                                    </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col flex-shrink-0">
                                            <div className="row">
                                                <div className="col-100 small-50">
                                                    {item.status === 'pending' &&
                                                        <button onClick={(e) => sfidahandle(e, item.players[0].idp1, 'cancel')} type="button" className="button button-fade button-small">Annulla</button>
                                                    }
                                                </div>
                                                <div className="col-100 small-50">
                                                    {item.status === 'processing' &&
                                                        <button onClick={(e) => accettasfidahandle(e, item.id, 'accept')} type="button" className="button button-fade button-small">Accetta</button>
                                                    }
                                                </div>
                                            </div>
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
