import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GetCookie from "./hooks/getCookie";
import SetCookie from "./hooks/setCookie";
import FontAwesome from 'react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/fontawesome-free-solid'
import logo from './assets/pallina.png';


const Login = () => {
    const [user, setuser] = useState([]);
    const [email, emailupdate] = useState('');
    const [getiduser, setiduser] = useState(null);
    const [password, passwordupdate] = useState('');
    const [setclub, setclubupdate] = useState('');

    const [loading, setloading] = useState(false);
    const usenavigate = useNavigate();
    const savelogin = GetCookie('utente');


    useEffect(() => {


        // sessionStorage.clear();
        if (savelogin !== undefined) {

            const obuser = JSON.parse(savelogin);

            // setuser(obuser);

            sessionStorage.setItem('email', obuser.email);
            sessionStorage.setItem('userrole', obuser.role);
            sessionStorage.setItem('iduser', obuser.id);
            sessionStorage.setItem('fullname', obuser.name);
            sessionStorage.setItem('stoinsfida', obuser.insfida);
            localStorage.setItem('datiuserlogin', JSON.stringify(obuser));
            sessionStorage.setItem('club', obuser.codiceclub);
            sessionStorage.setItem('clubname', obuser.club);

 
            
            // toast.success('Success');
            usenavigate('/ChallengeList')
            // console.log(obuser)


        } else {
            console.log('cookie vuoto')
        }
    }, []);


    const ProceedLogin = (e) => {
        setloading(true)
        e.preventDefault();
        if (validate()) {
            ///implentation
            // console.log('proceed');
            //getUsersid();
            fetch(window.$produrl + "/user?email=" + email + "&codiceclub=" + setclub).then((res) => {
                if (!res.ok) {
                    toast.error('Selezionare il club');
                    setloading(false);
                }

                return res.json();
            }).then((resp) => {

                if (Object.keys(resp).length === 0) {
                    setloading(false)
                    toast.error(email + ' not valid');
                } else {

                    setuser(resp);
                    // console.log(resp[0].password)


                    //  console.log(JSON.stringify(user.map(({ password }) => password)));
                    //     console.log(user.map(({ password }) => password));

                    if (resp[0].password === password) {
                        //    RenoveCookie('utente')
                        SetCookie('utente', JSON.stringify(resp[0]));
                        sessionStorage.setItem('email', email);
                        sessionStorage.setItem('userrole', resp[0].role);
                        sessionStorage.setItem('iduser', resp[0].id);
                        sessionStorage.setItem('fullname', resp[0].name);
                        sessionStorage.setItem('stoinsfida', resp[0].insfida);
                        sessionStorage.setItem('club', resp[0].codiceclub);
                        sessionStorage.setItem('clubname', resp[0].club)
                        localStorage.setItem('datiuserlogin', JSON.stringify(resp[0]));
                        toast.success('Success');
                        setloading(false)
                        usenavigate('/ChallengeList')
                    } else {
                        setloading(false)
                        toast.error('Please Enter valid credentials');
                    }
                }
            }).catch((err) => {
                setloading(false)

                toast.error('Login Failed due to :' + err.message);
            });
        } else {
            setloading(false)
        }
    }


    function selectclub(club) {
        setclubupdate(club)
        sessionStorage.setItem('club', club)
        checkclub(club); //imposto la url del db in base al codice club
        console.log(club)
        console.log(window.$produrl)

    }

    function checkclub(clubid) {
        if (clubid === 'DM00') {
         window.$produrl = "https://tennissapp.onrender.com";
   //     window.$produrl = "http://localhost:10000";
        } else if (clubid === 'DM01') {
            //    url di altro club
        }
        else if (clubid === 'DM02') {     //  DB test e prove
            window.$produrl = "https://testprovedb.onrender.com";
        } 
    }
    const validate = () => {
        let result = true;
        if (setclub === '' || setclub === null) {
            setloading(false);
            result = false;
            toast.warning('Please Enter Club');
        }
        if (email === '' || email === null) {
            setloading(false);
            result = false;
            toast.warning('Please Enter email');
        }
        if (password === '' || password === null) {
            setloading(false);
            result = false;
            toast.warning('Please Enter Password');
        }
        return result;
    }

    return (
        <div className="page-content">
            <div className="offset-lg-3 col-lg-6">
                <div style={{ marginTop: '80px' }}>
                    <form onSubmit={ProceedLogin} className="container">
                        <div className="card">
                            <div className="card-header">
                                <h2>User Login</h2>
                                <span><a href="/login"><img src={logo} width="30px" /></a></span>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Club <span className="errmsg">*</span></label>
                                    <select onChange={e => selectclub(e.target.value)} className="form-control">
                                        <option value="">seleziona club</option>

                                        <option value="DM00">Rocca Padel</option>
                                        <option value="DM02">Green Club</option>
                                        {/*  <option value="DM01">SpinUptennis</option> */}

                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Email <span className="errmsg">*</span></label>
                                    <input style={{ textTransform: 'lowercase' }} value={email} onChange={e => emailupdate(e.target.value.toLowerCase())} className="form-control"></input>
                                </div>
                                <div className="form-group">
                                    <label>Password <span className="errmsg">*</span></label>
                                    <input id="password" type="password" value={password} onChange={e => passwordupdate(e.target.value)} className="form-control"></input>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button disabled={loading} type="submit" className="btn btn-primary">{loading && <FontAwesomeIcon icon="fa-solid fa-spinner" spinPulse size="lg" style={{ color: "#fcfcfc", }} />}Login</button> |
                                {/* <Link className="btn btn-success" to={'/register'}>Sing </Link> */}
                            </div>
                            <span><a href="/Regolamento.html">Regolamento</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;