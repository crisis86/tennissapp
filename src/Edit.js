import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Edit = () => {

    //const [id, idchange] = useState(0);
    const id = useParams()

 
    
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
   

    const navigate = useNavigate();
     

     useEffect(() => {
        lastidjson();
    }, []);


 function  lastidjson() {
  
    fetch(window.$produrl+"/user/"+id['id'], {
        method:'GET',
        headers:{
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
            errormessage ="Le password non conicidono";
        }
        if (email === null || email === '') {
            isproceed = false;
            errormessage += ' Email';
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

 


    const handlesubmit = (e) => {
            e.preventDefault();
            let regobj = {email, password, name, phone, country, role, address, gender, posizione,insfida};
            if (IsValidate()) {
          //  console.log(regobj);
            fetch(window.$produrl+"/user/"+id['id'], {
                method: "PUT",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(regobj)
            }).then((res) => {
                toast.success('Modified successfully.') 
               // navigate('/Player');
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
                                        <label>Poizione <span className="errmsg">*</span></label> 
                                        <input type="number" style={{background: '#32ab32', opacity:0.8, color:"white"}}  value={posizione} onChange={e => posizionechange(e.target.value)}  className="form-control"></input>
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
                                        <input disabled value={email}  onChange={e => emailchange(e.target.value)} className="form-control"></input>
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
                            <button type="submit" className="btn btn-primary">Modifica</button> |
                            
                        </div>
                    </div>
                </form>
            </div>


        </div>
    );
}

export default Edit;