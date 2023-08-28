import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const Login = () => {
    const [user, setuser] = useState([]);
    const [email, emailupdate] = useState('');
    const [getiduser, setiduser] = useState(null);
    const [password, passwordupdate] = useState('');
    const usenavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();

    }, []);


    const ProceedLogin = (e) => {
        e.preventDefault();
        if (validate()) {
            ///implentation
            // console.log('proceed');
            //getUsersid();
 
            fetch("https://tennissapp.vercel.app/user?email=" + email,
            {
                headers:{
                'accept': 'application/json',
                'User-agent': '*',
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': '*',
                }
            }).then((res) => {
                if (!res.ok) {console.log('non è ok');}
                console.log(res);
                console.log(res.text());
                return res.json();
            }).then((resp) => {
                   console.log(resp.password)

                if (Object.keys(resp).length === 0) {
                    toast.error('Please Enter valid username');
                } else {
                    setuser(resp);
                    // console.log(resp[0].password)

                    //  console.log(JSON.stringify(user.map(({ password }) => password)));
                    //     console.log(user.map(({ password }) => password));
                    console.log(password);

                    if (resp[0].password === password) {

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
        <div className="row">
            <div className="list cards-list inset margin-vertical-half no-chevron no-hairlines no-hairlines-between" style={{ marginTop: '100px' }}>
                <form onSubmit={ProceedLogin} className="">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Email <span className="errmsg">*</span></label>
                                <input value={email} onChange={e => emailupdate(e.target.value)} className="form-control"></input>
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