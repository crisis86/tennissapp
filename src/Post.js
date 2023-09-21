
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import avatar from './assets/avatar.png';
    const myrole = sessionStorage.getItem('userrole')

const Post = () => {

    const myrole = sessionStorage.getItem('userrole')
    const [title, setitle] = useState('Nuovo Post');
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
                    loadpost();

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


    const handleremove =(e ,param) => {
        if (window.confirm("Sei sicuro? l'operazione porterà alla cancellazione dei dati")) {
            deletpost(param);
          
        }
    }
    function deletpost(idpost) {

        fetch(window.$produrl+"/post/" + idpost, {
            method: 'DELETE',
        }).then((result) => {
            //  console.log(result)
            result.json().then((resp) => {
                toast.success("Post Eliminato!");
                loadpost();
            })
        }).catch((err) => {
            toast.error(err.message);
        });
    }
    return (

        <div>

            <div  className="">
                <form style={{padding:'0',borderBottom:'1px solid #e7e7e7'}}className="container" onSubmit={handlesubmit}>
                    <div className="card">

                        <div style={{padding:'0'}} className="card-body">

                            <div className="row">


                                <div style={{ display: 'none' }} className="col-lg-6">
                                    <div className="form-group">
                                        <label>Titolo <span className="errmsg">*</span></label>
                                        <input  maxLength={50} value={title} onChange={e => setitle(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <textarea placeholder="Scrivi un nuovo post pubblico" style={{ height: '45', display: 'block', width: '100%' }} maxLength={250} value={descrizione} onChange={e => setdescr(e.target.value)} className="form-control"></textarea>
                                    </div>
                                </div>


                            </div>

                        </div>
                        <div style={{padding:'0'}} className="card-footer">
                            <button type="submit" className="btn btn-primary">Invia</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="page-content-post">
                <div className="list cards-list inset margin-vertical-half no-chevron no-hairlines no-hairlines-between">
                    <ul className="row align-items-stretch">
                        {post &&
                            post.sort((a, b) => a.id < b.id ? 1 : -1).map((item, index) => (
                                <li key={index + 1} className="col-100 small-50 xlarge-100">
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
                                                                {myrole ==='admin' && 
                                                            <button className="button" onClick={(e) => handleremove(e, item.id)}>X </button>
                                                                }
                                                                <i className="postnews">News</i>
                                                            </div>
                                                        </div>
                                                        <div className="item-row">
                                                            <div className="item-cell">
                                                                <a className='link' href={'/Challenge-single/' + item.iduser + '/' + item.nameuser}>
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
            </div>
        </div>

    );
}

export default Post;