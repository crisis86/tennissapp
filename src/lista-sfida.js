import './assets/framework7-bundle.css';
import React, { Component, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from './assets/logo.svg';
import Swal from 'sweetalert2';


const Listasfida = () => {
    const iduser = parseInt(sessionStorage.getItem('iduser'))
    const [open, setOpen] = useState(false);
    const [stoinsfida, setstoinsifa] = useState(sessionStorage.getItem('stoinsfida'));
    const [custlist, cutlistupdate] = useState([]);
    const [challengelist, challengelistupdta] = useState([]);

    const navigate = useNavigate();
    //costanti sfidante


    useEffect(() => {
        loadlistplayer();
        checksfidapending();

    }, []);



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
                const found = custlist.filter(obj => {
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
                    //  console.log(result)
                    result.json().then((resp) => {

                        flagmesfida(status);

                        if (status === 'update') {
                            addchallenge(idp1);

                        } else {
                            removechallenge(idp1);
                        }

                        loadlistplayer();
                        checksfidapending();
                    })
                }).catch((err) => {
                    toast.error(err.message);
                });

            }
        })
    }

    function flagmesfida(status) {

        const found = custlist.filter(obj => {
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

    function addchallenge(idplayer) {

        const current = new Date();
        const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;
        // console.log(date);
        const obj = {
            "datasfida": date,
            "players": [iduser, idplayer],
            "status": 'pending',
            "set1": "",
            "set2": "",
            "set3": "",
            "set4": "",
            "set5": ""
        }
        console.log(obj);

        fetch("http://localhost:8000/challenge", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(obj)
        }).then((res) => {
            console.log('challenge creato')
            sessionStorage.setItem('stoinsfida', true);
            //    setstoinsifa(true);
            // console.log('sto in sfida: ' +stoinsfida)
        }).catch((err) => {
            toast.error('addchallenge :' + err.message);
        });

    }

    function removechallenge(idplayer) {

        let idriga = 0;

        const found = challengelist.filter(obj => {

            if (obj.players.includes(idplayer))

                obj.status = "cancel";
            idriga = obj.id;

            return obj.id;
        });
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
    }

    const checksfidapending = () => {

        fetch("http://localhost:8000/challenge?status=pending").then(res => {
            return res.json();
        }).then(resp => {

            challengelistupdta(resp);


        }).catch((err) => {
            toast.error('checksfidapending failerd to :' + err.message);
        });

    }

    const loadlistplayer = () => {
        fetch("http://localhost:8000/user?role=player").then(res => {
            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(res => {

            cutlistupdate(res);
            // console.log(custlist);

        });
    }
    return (
        <>
            <div>
                <h1>Utenti da sfidare</h1>
                <div className="row">
                    <div className="list cards-list inset margin-vertical-half no-chevron no-hairlines no-hairlines-between">
                        <ul className="row">
                            {custlist &&
                                custlist.map((item) => (
                                    <>
                                        {item.id !== iduser &&
                                            <li key={item.id} className="col-50 small-33 large-25 xlarge-20">
                                                <div className="item-content">
                                                    <div className="item-inner item-cell padding-vertical text-align-center">
                                                        <div className="item-row">
                                                            <div className="item-cell">

                                                                <button type="button" className="state-toggle button button-icon button-round button-small margin-half no-padding position-absolut">
                                                                    <i className="state-inactive icon material-icons font-size-20 color-gray">star</i>
                                                                    <i className="state-active icon material-icons font-size-20 color-amber">star</i>
                                                                </button>

                                                                <a className='App-link' href="#">
                                                                    <img className="shape-auto" src="" loading="lazy" height="64" width="64" alt="" />
                                                                    <div className="font-size-16 font-weight-600 margin-top-half single-line-text text-color-body">{item.name}</div>
                                                                </a>
                                                                <div className="font-size-14 single-line-text text-color-gray">{item.country}</div>

                                                            </div>
                                                        </div>
                                                        <div className="item-row margin-top">
                                                            <div className="item-cell">

                                                                <div className="item-cell">
                                                                    {item.insfida ? (
                                                                        <button onClick={(e) => sfidahandle(e, item.id, 'cancel')} type="button" className="button button-fade button-small">Annulla</button>
                                                                    ) : (
                                                                        <button disabled={stoinsfida === 'true'} onClick={(e) => sfidahandle(e, item.id, 'update')} type="button" className="button button-fill button-small">Sfida</button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        }
                                    </>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>

        </>

    );
}

export default Listasfida;