import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    const [insfida, insfidachange]=useState(false);
    const [chek, setcheck] = useState(false);

    const navigate = useNavigate();
     

     useEffect(() => {
        lastidjson();
    }, []);


    function  lastidjson() {

        let pos ={};
  
    fetch(window.$produrl+"/user", {
        method:'GET'
        }).then(res => {
            if (!res.ok) {
           // console.log('nulla')
                return false 
            }
            return res.json();
        }).then(res => {
           
            pos = res;
 
          let maxValue = Math.max(...pos.map(o => o.posizione))

          posizionechange(maxValue+1)
            
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
            errormessage ="Le password non conicidono";
        }
        if (email === null || email === '') {
            isproceed = false;
            errormessage += ' Email';
        } 
        if(chek) {
            isproceed = false;
            errormessage = email+' già registatrata';
            
           }
       
          

        if(!isproceed){
            toast.warning(errormessage)
        }else{
            if(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)){

            }else{
                isproceed = false;
                toast.warning('Please enter the valid email')
            }
        }
        return isproceed;
    }


    function checkemail(email) {
        
        fetch(window.$produrl+"/user?role=player&email="+email).then(res => {
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


    const handlesubmit = (e) => {
            e.preventDefault();
            let regobj = {email, password, name, phone, country, role, address, gender, posizione,insfida};
            if (IsValidate()) {
          //  console.log(regobj);
            fetch(window.$produrl+"/user", {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(regobj)
            }).then((res) => {
                toast.success('Registered successfully.') 
                navigate('/login');
            }).catch((err) => {
                toast.error('Failed :' + err.message);
            });
        }
    }
    return (
        <div>
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handlesubmit}>
                    <div className="card">
                        <div className="card-header">
                            <h1>User Registeration</h1>
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        {/* <label>User Name <span className="errmsg">*</span></label> */}
                                        <input type="hidden" value={posizione} onChange={e => posizione(e.target.value)}  className="form-control"></input>
                                      {/* <input disabled value={id} onChange={e => idchange(e.target.value)} className="form-control"></input>  */}
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
                                        <label>Full Name <span className="errmsg">*</span></label>
                                        <input value={name} onChange={e => namechange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Email <span className="errmsg">*</span></label>
                                        <input value={email}  onChange={e => emailchange(e.target.value)} className="form-control"></input>
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

                            </div>

                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Register</button> |
                            <Link to={'/login'} className="btn btn-danger">Close</Link>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    );
}

export default Register;