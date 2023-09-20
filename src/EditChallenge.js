import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";



const EditChallenge = () => {

    //const [id, idchange] = useState(0);
    const id = useParams()



    const [datacreate, setdatacreate] = useState("");
    const [datasfida, setdatasfida] = useState("");

    const [p1, setp1] = useState("");
    const [p2, setp2] = useState("");

    const [status, setstatus] = useState("");

    const [idp1, setidplayer1] = useState(0)
    const [idp2, setidplayer2] = useState(0)


    const [set1, setset1] = useState(0)
    const [set2, setset2] = useState(0)
    const [set3, setset3] = useState(0)
 
    const navigate = useNavigate();


    useEffect(() => {
        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else{

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
            setdatacreate(resp.datacreate)
            setidplayer1(resp.players[0].idp1)
            setidplayer2(resp.players[1].idp2)
            setp1(resp.players[0].p1)
            setp2(resp.players[1].p2)
            setstatus(resp.status)
            setset1(resp.set1)
            setset2(resp.set2)
            setset3(resp.set3)
 
        });
    }

    const handlesubmit = (e) => {
        e.preventDefault();

     
        let regobj = {
            "datacreate": datacreate,
            "datasfida": datasfida,
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
            "set3": set3
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
                                        <label>Status <span className="errmsg">*</span></label>
                                        <select value={status} onChange={e => setstatus(e.target.value)} className="form-control">
                                         
                                           <option value="processing">processing</option>
                                            <option value="cancel">cancel</option>
                                            <option value="pending">pending</option>
                                            <option value="complete">complete</option>
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