import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from './assets/avatar.png';

const Home = () => {

    const usenavigate = useNavigate();
    const uname = sessionStorage.getItem('email')
    const datiuserloging = JSON.parse(localStorage.getItem('datiuserlogin'))
    const [post, setposts] = useState([]);


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



    useEffect(() => {
        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            usenavigate('/login');
        } else {
            loadpost();
        }
    }, []);


    return (
        <div className="page-content">
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

                                                            <i className="postnews">News</i>

                                                        </div>
                                                    </div>
                                                    <div className="item-row">
                                                        <div className="item-cell">
                                                            <span style={{ fontSize: "12px" }}> <i>{item.datapost}</i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="item-row margin-top">
                                                <div className="item-cell">
                                                    <a href="/jobs-single/" className="font-size-14 multi-line-text lines-3 text-color-gray">{item.descrizione}</a>
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
    );
}

export default Home;
