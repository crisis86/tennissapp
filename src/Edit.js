import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Edit = () => {

    //const [id, idchange] = useState(0);
    const id = useParams()
    const myrole = sessionStorage.getItem('userrole')
    const [name, namechange] = useState("");
    const [password, passwordchange] = useState("");
    const [confirmpassword, confirmpassworchange] = useState("");
    const [email, emailchange] = useState("");
    const [phone, phonechange] = useState("");
    const [country, countrychange] = useState("");
    const [role, rolechange] = useState("");
    const [address, addresschange] = useState("");
    const [gender, genderchange] = useState("");
    const [posizione, posizionechange] = useState(0);
    const [insfida, insfidachange] = useState(false)
    const [fuorigioco, fuorigiocochange] = useState(false)
    const [fuorigiocochek, setfuorigiocochek] = useState(false)
    const [datafuorigioco, setdatafuorigioco] = useState("")
    const [codiceclub, setsetclub] = useState(sessionStorage.getItem('club'));
    const [club, setsetclubname] = useState('');


    const navigate = useNavigate();



    useEffect(() => {

        if(codiceclub==="" || codiceclub === undefined){
            navigate('/login');    
        }

        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else {

            lastidjson();
        }
    }, []);



    useEffect(() => {

        if (fuorigioco !== fuorigiocochek) {

            if (fuorigioco) {
                let nuovadata = new Date().toLocaleDateString()
                console.log(nuovadata)
                setdatafuorigioco(nuovadata)
            } else {
                console.log('nessuna data')

                setdatafuorigioco("")

            }
        }
    }, [fuorigioco]);

    function lastidjson() {

        fetch(window.$produrl + "/user/" + id['id'], {
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


            namechange(resp.name)
            passwordchange(resp.password)
            confirmpassworchange(resp.password)
            emailchange(resp.email)
            countrychange(resp.country)
            phonechange(resp.phone)
            addresschange(resp.address)
            rolechange(resp.role)
            genderchange(resp.gender)
            posizionechange(resp.posizione)
            insfidachange(resp.insfida)
            fuorigiocochange(resp.fuorigioco)
            setdatafuorigioco(resp.datafuorigioco)
            setfuorigiocochek(resp.fuorigioco)
            setsetclub(resp.codiceclub)
            setsetclubname(resp.club)


        });
    }



    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';
        /*  if (id === null || id === '') {
             isproceed = false;
             errormessage += ' Username';
         } */


        if (name === null || name === '') {
            isproceed = false;
            errormessage += ' Fullname';
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




    const handlesubmit = (e) => {
        e.preventDefault();

        let trimtext = name.trim()
        namechange(trimtext)

        let trimemail = email.trim()
        emailchange(trimemail)

        if (insfida) {
            fuorigiocochange(false)
        }



        let regobj = { email, password, name, phone, country, role, address, gender, posizione, insfida, fuorigioco, datafuorigioco, codiceclub,club};
        if (IsValidate()) {
            //  console.log(regobj);
            fetch(window.$produrl + "/user/" + id['id'], {
                method: "PUT",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(regobj)
            }).then((res) => {
                toast.success('Modified successfully.')
                if (myrole === 'admin') {
                    navigate('/Player');
                } else {
                    navigate('/');
                }

            }).catch((err) => {
                toast.error('Failed :' + err.message);
            });
        }
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
                                    {myrole === 'admin' &&
                                        <div className="form-group">
                                            <label>Poizione <span className="errmsg">*</span></label>
                                            <input type="number" style={{ background: '#32ab32', opacity: 0.8, color: "white" }} value={posizione} onChange={e => posizionechange(parseInt(e.target.value))} className="form-control"></input>
                                            {/* <input disabled value={id} onChange={e => idchange(e.target.value)} className="form-control"></input>  */}
                                        </div>
                                    }
                                </div>
                                <div className="col-lg-6">
                                <label>Club:{codiceclub} - {club}</label>

                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Full Name <span className="errmsg">*</span></label>
                                        <input disabled value={name} onChange={e => namechange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Email <span className="errmsg">*</span></label>
                                        <input value={email} onChange={e => emailchange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
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
                                        <label>Phone <span className="errmsg"></span></label>
                                        <input value={phone} onChange={e => phonechange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Country <span className="errmsg">*</span></label>
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
                                        <label>Address</label>
                                        <textarea value={address} onChange={e => addresschange(e.target.value)} className="form-control"></textarea>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <br></br>
                                        <input type="radio" checked={gender === 'male'} onChange={e => genderchange(e.target.value)} name="gender" value="male" className="app-check"></input>
                                        <label>Male</label>
                                        <input type="radio" checked={gender === 'female'} onChange={e => genderchange(e.target.value)} name="gender" value="female" className="app-check"></input>
                                        <label>Female</label>
                                    </div>
                                </div>
                                {myrole === 'admin' &&
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Sfida Flag</label>

                                            <select value={insfida} onChange={e => insfidachange((JSON.parse(e.target.value)))} className="form-control">
                                                <option value="true">Si</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                    </div>
                                }
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Fuorigioco</label>

                                        <select disabled={insfida} value={fuorigioco} onChange={e => fuorigiocochange((JSON.parse(e.target.value)))} className="form-control">
                                            <option value="true">Si</option>
                                            <option value="false">No</option>
                                        </select>
                                        Data:{datafuorigioco !== '' && datafuorigioco}
                                        <input type="hidden" value={fuorigiocochek} className="form-control"></input>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="card-footer">
                            <button  type="submit" className="btn btn-primary">Modifica</button>

                        </div>
                        <span><a href="/Regolamento.html">Regolamento</a></span>
                    </div>
                </form>
            </div>


        </div>
    );
}

export default Edit;