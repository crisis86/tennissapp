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
    const [loading, setloading] = useState(false);
    const usenavigate = useNavigate();
    const savelogin = GetCookie('utente');


    useEffect(() => {
    
    
        // sessionStorage.clear();
        if (savelogin !== undefined ) {
             
            const obuser =JSON.parse(savelogin);

           // setuser(obuser);

                sessionStorage.setItem('email', obuser.email);
                sessionStorage.setItem('userrole', obuser.role);
                sessionStorage.setItem('iduser', obuser.id);
                sessionStorage.setItem('fullname', obuser.name);
                sessionStorage.setItem('stoinsfida', obuser.insfida);
                localStorage.setItem('datiuserlogin', JSON.stringify(obuser));

               // toast.success('Success');
                usenavigate('/')
               // console.log(obuser)

           
        }else {
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

            fetch(window.$produrl + "/user?email=" + email,
                {
                    headers: {
                        accept: 'application/json',
                    }
                }).then((res) => {
                    if (!res.ok) {    setloading(false); }

                    return res.json();
                }).then((resp) => {

                    if (Object.keys(resp).length === 0) {
                        setloading(false)
                        toast.error('Please Enter valid username');
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
                            localStorage.setItem('datiuserlogin', JSON.stringify(resp[0]));
                            toast.success('Success');
                            setloading(false)
                            usenavigate('/')
                        } else {
                            setloading(false)
                            toast.error('Please Enter valid credentials');
                        }
                    }
                }).catch((err) => {
                    setloading(false)
                   
                    toast.error('Login Failed due to :' + err.message);
                });
        }else {
            setloading(false)
        }
    }


    function getUsersid() {
        fetch("http://localhost:10000/user?email=" + email).then((result) => {
            result.json().then((resp) => {
                console.log(resp.id)

                setiduser(resp.id)
            })
        })
    }


    const validate = () => {
        let result = true;
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
                                <label>Email <span className="errmsg">*</span></label>
                                <input style={{textTransform:'lowercase'}} value={email} onChange={e => emailupdate(e.target.value)} className="form-control"></input>
                            </div>
                            <div className="form-group">
                                <label>Password <span className="errmsg">*</span></label>
                                <input type="password" value={password} onChange={e => passwordupdate(e.target.value)} className="form-control"></input>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button disabled={loading} type="submit" className="btn btn-primary">{loading && <FontAwesomeIcon icon="fa-solid fa-spinner" spinPulse size="lg" style={{color: "#fcfcfc",}} />}Login</button> |
                            <Link className="btn btn-success" to={'/register'}>Sing </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
</div>
    );
}

export default Login;