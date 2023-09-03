import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GetCookie from "./hooks/getCookie";
import SetCookie from "./hooks/setCookie";
import RenoveCookie from "./hooks/removeCookie";



const Login = () => {
    const [user, setuser] = useState([]);
    const [email, emailupdate] = useState('');
    const [getiduser, setiduser] = useState(null);
    const [password, passwordupdate] = useState('');
    const usenavigate = useNavigate();
    const savelogin = GetCookie('utente');


    useEffect(() => {
    
    
        // sessionStorage.clear();
        if (savelogin !== undefined) {
            
            
            const obuser =JSON.parse(savelogin);


            setTimeout(() => {

                sessionStorage.setItem('email', user.email);
                sessionStorage.setItem('userrole', user.role);
                sessionStorage.setItem('iduser', user.id);
                sessionStorage.setItem('fullname', user.name);
                sessionStorage.setItem('stoinsfida', user.insfida);
                localStorage.setItem('datiuserlogin', JSON.stringify(user));

                toast.success('Success');
                usenavigate('/')
               // console.log(obuser)

            }, 10);
        }
    }, []);


    const ProceedLogin = (e) => {
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
                    if (!res.ok) { console.log('non è ok'); }

                    return res.json();
                }).then((resp) => {

                    if (Object.keys(resp).length === 0) {
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
                            usenavigate('/')
                        } else {
                            toast.error('Please Enter valid credentials');
                        }
                    }
                }).catch((err) => {
                    console.log(err.message)
                    toast.error('Login Failed due to :' + err.message);
                });
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
            result = false;
            toast.warning('Please Enter Username');
        }
        if (password === '' || password === null) {
            result = false;
            toast.warning('Please Enter Password');
        }
        return result;
    }

    return (
        <div className="offset-lg-3 col-lg-6">
            <div style={{ marginTop: '80px' }}>
                <form onSubmit={ProceedLogin} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
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
                            <button type="submit" className="btn btn-primary">Login</button> |
                            <Link className="btn btn-success" to={'/register'}>New User</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default Login;