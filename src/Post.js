
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Post = () => {

    const [title, setitle] = useState('');
    const [descrizione, setdescr] = useState('');
    const [datapost, setdate] = useState(new Date().toLocaleString())
    const [visible, setvisible] = useState(true);
    const nameuser = sessionStorage.getItem('email')
    const iduser = sessionStorage.getItem('id')
    const usenavigate = useNavigate();

    useEffect(() => {
        let email = sessionStorage.getItem('email')
 
        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            usenavigate('/login');
        }

        

    }, [])

    const handlesubmit = (e) => {

        e.preventDefault();

        if (window.confirm("Sei sicuro?")) {
           
            let regobj = { title, descrizione, datapost, iduser, nameuser, visible };
            if (IsValidate()) {
                
                fetch(window.$produrl + "/post", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(regobj)
                }).then((res) => {
                    toast.success('Post Inerito.')

                }).catch((err) => {
                    toast.error('Failed :' + err.message);
                });
            }
        }

    }


    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';

        if (title === null || title === '') {
            isproceed = false;
            errormessage += ' title';
        }
        if (descrizione === null || descrizione === '') {
            isproceed = false;
            errormessage += ' descrizione';
        }

        if (!isproceed) {
            toast.warning(errormessage)
        }

        console.log(title)
        console.log(descrizione)
        return isproceed;
    }
    return (

        <div>
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handlesubmit}>
                    <div className="card">
                        <div className="card-header">
                            <h1>Nuovo Post Pubblico</h1>
                        </div>
                        <div className="card-body">

                            <div className="row">


                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Titolo <span className="errmsg">*</span></label>
                                        <input maxLength={50} value={title} onChange={e => setitle(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Post</label>
                                        <textarea maxLength={250} value={descrizione} onChange={e => setdescr(e.target.value)} className="form-control"></textarea>
                                    </div>
                                </div>


                            </div>

                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Invia</button> |
                        </div>
                    </div>
                </form>
            </div>


        </div>

    );
}

export default Post;