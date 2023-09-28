import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FontAwesome from 'react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/fontawesome-free-solid'

const Register = () => {

    //const [id, idchange] = useState(0);

    const [name, namechange] = useState("");
    const [password, passwordchange] = useState("");
    const [confirmpassword, confirmpassworchange] = useState("");
    const [email, emailchange] = useState("");
    const [phone, phonechange] = useState("");
    const [country, countrychange] = useState("Italia");
    const [role, rolechange] = useState("player");
    const [address, addresschange] = useState("");
    const [gender, genderchange] = useState("male");
    const [posizione, posizionechange] = useState(0);
    const [insfida, insfidachange] = useState(false);
    const [fuorigioco, fuorigiocochange] = useState(false);
    const [datafuorigioco, setdatafuorigioco] = useState("");
    const [chek, setcheck] = useState(false);
    const [chekname, setcheckname] = useState(false);
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);



    useEffect(() => {
        lastidjson();
    }, []);


    function lastidjson() {

        let pos = {};

        fetch(window.$produrl + "/user", {
            method: 'GET'
        }).then(res => {
            if (!res.ok) {
                // console.log('nulla')
                return false
            }
            return res.json();
        }).then(res => {

            pos = res;

            let maxValue = Math.max(...pos.map(o => o.posizione))

            posizionechange(maxValue + 1)

        });
    }

    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';
        /*  if (id === null || id === '') {
             isproceed = false;
             errormessage += ' Username';
         } */
        checkemail(email);

        if (chek) {
            setloading(false);
            isproceed = false;
            errormessage = email + ' già registatrata';
        }

        checkfullname(name)

        if (chekname) {
            setloading(false);
            isproceed = false;
            errormessage = name + ' già esistente';
        }

        if (name === null || name === '') {
            isproceed = false;
            errormessage += 'Giocatore';
        }
        if (phone === null || phone === '') {
            isproceed = false;
            errormessage += '  Telefono';
        }
        if (password === null || password === '') {
            isproceed = false;
            errormessage += ' Password';
        }
        if (password !== confirmpassword) {
            isproceed = false;
            errormessage = "Le password non conicidono";
        }
        if (email === null || email === '') {
            isproceed = false;
            errormessage += ' Email';
        }




        if (!isproceed) {
            toast.warning(errormessage)
        } else {
            if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {

            } else if (/^[a-zA-Z0-9]+\.[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {

            } else if (/^[a-zA-Z0-9]+\-[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {

            } else if (/^[a-zA-Z0-9]+\_[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {

            } else if (/^[a-zA-Z0-9]+\_[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+\.[A-Za-z]+$/.test(email)) {

            } else if (/\S+@\S+\.\S+/.test(email)) {

            } else {
                isproceed = false;
                toast.warning('Please enter the valid email')
            }
        }
        return isproceed;
    }


    function checkemail(email) {


        fetch(window.$produrl + "/user?role=player&email=" + email).then(res => {
            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(resp => {
            if (Object.keys(resp).length === 0) {

                setcheck(false)
            } else {

                setcheck(true);
            }
        });
    }

    function checkfullname(nome) {

        fetch(window.$produrl + "/user?role=player&name=" + nome).then(res => {
            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(resp => {
            if (Object.keys(resp).length === 0) {

                setcheckname(false)
            } else {
                setcheckname(true);
            }
        });
    }

    const handlesubmit = (e) => {
        setloading(true)
        e.preventDefault();
        setTimeout(() => {

            let trimtext = name.trim()
            namechange(trimtext)

            let trimemail = email.trim()
            emailchange(trimemail)
        
            let regobj = {email, password, name, phone, country, role, address, gender, posizione, insfida, fuorigioco, datafuorigioco};
            if (IsValidate()) {
                //  console.log(regobj);
                fetch(window.$produrl + "/user", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(regobj)
                }).then((res) => {
                    setloading(false)

                    toast.success('Registered successfully.')
                   // navigate('/login');
                    navigate('/player');
                }).catch((err) => {
                    setloading(false)
                    toast.error('Failed :' + err.message);
                });
            } else {
                setloading(false)
            }
        }, 2500);

    }

    return (
        <div className="page-content">
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handlesubmit}>
                    <div className="card">
                        <div className="card-header">
                            <h1>Dati Utente</h1>
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        {/* <label>User Name <span className="errmsg">*</span></label> */}
                                        <input type="hidden" value={posizione} onChange={e => posizione(e.target.value)} className="form-control"></input>
                                        {/* <input disabled value={id} onChange={e => idchange(e.target.value)} className="form-control"></input>  */}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Nome e Cognome <span className="errmsg">*</span></label>
                                        <input style={{ textTransform: 'capitalize' }} value={name} onChange={e => namechange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Email <span className="errmsg">*</span></label>
                                        <input style={{ textTransform: 'lowercase' }} value={email.trim()} onBlur={e => IsValidate()} onChange={e => emailchange(e.target.value.toLowerCase())} className="form-control"></input>
                                    </div>
                                </div>  <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Password <span className="errmsg">*</span></label>
                                        <input value={password} onChange={e => passwordchange(e.target.value)} type="password" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Confirm Password <span className="errmsg">*</span></label>
                                        <input value={confirmpassword} onChange={e => confirmpassworchange(e.target.value)} type="password" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Cell <span className="errmsg"></span></label>
                                        <input value={phone} type="number" onChange={e => phonechange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Paese <span className="errmsg">*</span></label>
                                        <select value={country} onChange={e => countrychange(e.target.value)} className="form-control">
                                            <option value="Italia">Italia</option>
                                            <option value="india">India</option>
                                            <option value="usa">USA</option>
                                            <option value="singapore">Singapore</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Indirizzo</label>
                                        <textarea value={address} onChange={e => addresschange(e.target.value)} className="form-control"></textarea>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Sesso</label>
                                        <br></br>
                                        <input type="radio" checked={gender === 'male'} onChange={e => genderchange(e.target.value)} name="gender" value="male" className="app-check"></input>
                                        <label>Male</label>
                                        <input type="radio" checked={gender === 'female'} onChange={e => genderchange(e.target.value)} name="gender" value="female" className="app-check"></input>
                                        <label>Female</label>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Fuorigioco</label>
                                            <select value={fuorigioco} onChange={e => fuorigiocochange((JSON.parse(e.target.value)))} className="form-control">
                                            <option value="true">Si</option>
                                            <option value="false">No</option>
                                        </select>
                                        </div>
                                    </div>

                            </div>

                        </div>


                        <div className="card-footer">
                            <button disabled={loading} type="submit" className="btn btn-primary">{loading && <FontAwesomeIcon icon="fa-solid fa-spinner" spinPulse size="lg" style={{ color: "#fcfcfc", }} />}Sing Up</button> |

                            <Link to={'/login'} className="btn btn-danger">Close</Link>
                        </div>
                        <span><a href="/Regolamento.html">Regolamento</a></span>
                    </div>
                </form>
            </div>


        </div>
    );

}

export default Register;