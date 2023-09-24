import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";



const EditChallenge = () => {

    //const [id, idchange] = useState(0);
    const id = useParams()



    const [datacreate, setdatacreate] = useState("");
    const [datasfida, setdatasfida] = useState("");
    const [orasfida, setordasfida] = useState("");

    const [p1, setp1] = useState("");
    const [p2, setp2] = useState("");

    const [status, setstatus] = useState("");

    const [idp1, setidplayer1] = useState(0)
    const [idp2, setidplayer2] = useState(0)


    const [set1, setset1] = useState(0)
    const [set2, setset2] = useState(0)
    const [set3, setset3] = useState(0)
    const [finalplayer, setfinalplayer] = useState(0)

    const navigate = useNavigate();


    useEffect(() => {
        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else {

            ladidchallenge();
        }
    }, []);


    function ladidchallenge() {

        fetch(window.$produrl + "/challenge/" + id['id'], {
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


            setdatasfida(resp.datasfida)
            setordasfida(resp.orasfida)
            setdatacreate(resp.datacreate)
            setidplayer1(resp.players[0].idp1)
            setidplayer2(resp.players[1].idp2)
            setp1(resp.players[0].p1)
            setp2(resp.players[1].p2)
            setstatus(resp.status)
            setset1(resp.set1)
            setset2(resp.set2)
            setset3(resp.set3)
            setfinalplayer(resp.finalplayer)

        });
    }

    const handlesubmit = (e) => {
        e.preventDefault();


        let regobj = {
            "datacreate": datacreate,
            "datasfida": datasfida,
            "orasfida":orasfida,
            "players": [
                {
                    "idp1": idp1,
                    "p1": p1
                },
                {
                    "idp2": idp2,
                    "p2": p2,
                }
            ],
            "status": status,
            "set1": set1,
            "set2": set2,
            "set3": set3,
            "finalplayer":finalplayer
        }

        //  console.log(regobj);
        fetch(window.$produrl + "/challenge/" + id['id'], {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(regobj)
        }).then((res) => {
            toast.success('Modified successfully.')
            navigate('/AdminChallenge');

        }).catch((err) => {
            toast.error('Failed :' + err.message);
        });

    }
    return (
        <div className="page-content">
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handlesubmit}>
                    <div className="card">
                        <div className="card-header">
                            <h1>Challenge</h1>
                        </div>
                        <div className="card-body">



                            <div className="row">
                                <div className="col-lg-6">

                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Set1 <span className="errmsg">*</span></label>
                                        <input value={set1} onChange={e => setset1(e.target.value)} type="text" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Set2 <span className="errmsg">*</span></label>
                                        <input value={set2} onChange={e => setset2(e.target.value)} type="text" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Set3 <span className="errmsg">*</span></label>
                                        <input value={set3} onChange={e => setset3(e.target.value)} type="text" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Data Sfida <i>DD/MM/YYYY</i> <span className="errmsg">*</span></label>
                                        <input value={datasfida} onChange={e => setdatasfida(e.target.value)} type="text" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Ora Sfida <span className="errmsg">*</span></label>
                                        <select value={orasfida} onChange={e => setordasfida((e.target.value))} className="form-control">
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
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Status <span className="errmsg">*</span></label>
                                        <select value={status} onChange={e => setstatus(e.target.value)} className="form-control">

                                            <option value="processing">In Corso</option>
                                            <option value="cancel">Annullata</option>
                                            <option value="pending">Attesa Avversario</option>
                                            <option value="complete">Completata</option>
                                        </select>

                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Modifica</button> |

                        </div>
                    </div>
                </form>
            </div>


        </div>
    );
}

export default EditChallenge;