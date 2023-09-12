
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import avatar from './assets/avatar.png';

const Post = () => {

    const [title, setitle] = useState('');
    const [descrizione, setdescr] = useState('');
    const [datapost, setdate] = useState(new Date().toLocaleString())
    const [visible, setvisible] = useState(true);
    const nameuser = sessionStorage.getItem('email')
    const iduser = sessionStorage.getItem('id')
    const [post, setposts] = useState([]);
    
    const usenavigate = useNavigate();

    useEffect(() => {
        let email = sessionStorage.getItem('email')
 
        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            usenavigate('/login');
        } else {
            loadpost();
        }

        

    }, [])

    const loadpost = () => {

        fetch(window.$produrl + "/post").then(res => {
            if (!res.ok) {
                console.log(res)
                // navigate('/');
                return false;
            }
            return res.json();
        }).then(res => {
            setposts(res);
        })


    }


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
        <div className="page-content">
        <div className="list cards-list inset margin-vertical-half no-chevron no-hairlines no-hairlines-between">
            <ul className="row align-items-stretch">
                {post &&
                    post.sort((a, b) => a.id < b.id ? 1 : -1).map((item, index) => (
                        <li  key={index + 1} className="col-100 small-50 xlarge-100">
                            <div className="item-content height-100">
                                <div className="item-inner item-cell height-100 padding-vertical">
                                    <div className="item-row flex-direction-column height-100">
                                        <div className="item-row">
                                            <div className="item-cell flex-shrink-0 width-auto align-self-flex-start">

                                                <img className="shape-auto" src={avatar} loading="lazy" height="48" width="48" alt="" />

                                            </div>
                                            <div className="item-cell">
                                                <div className="item-row">
                                                    <div className="item-cell">
                                                        {item.title}
                                                    </div>
                                                    <div className="item-cell flex-shrink-0 width-auto line-height-1">
                                                        <i className="postnews">News</i>
                                                    </div>
                                                </div>
                                                <div className="item-row">
                                                    <div className="item-cell">
                                                    <a className='link' href={'/Challenge-single/' + item.iduser+'/'+item.nameuser}>
                                                    <span style={{ fontSize: "14px" }}> <i>{item.nameuser}</i></span>
                                                    </a>
                                                        <span style={{ fontSize: "14px" }}> <i>{item.datapost}</i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item-row margin-top">
                                            <div className="item-cell">
                                                <div className="font-size-14 multi-line-text lines-3 text-color-gray">{item.descrizione}</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                }

            </ul>

            
        </div>
        <form className="container" onSubmit={handlesubmit}>
                    <div className="card">
                        <div className="card-header">
                            <h5>Nuovo Post Pubblico</h5>
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
                                        <textarea style={{height:'30px'}} maxLength={250} value={descrizione} onChange={e => setdescr(e.target.value)} className="form-control"></textarea>
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

    );
}

export default Post;