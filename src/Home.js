import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import avatar from './assets/avatar.png';


const Home = () => {


    const usenavigate = useNavigate();
    const uname = sessionStorage.getItem('email')
    const datiuserloging = JSON.parse(localStorage.getItem('datiuserlogin'))
    const [post, setposts] = useState([]);
    const [challenge, setchallenge] = useState([]);
    const location = useLocation();


    useEffect(() => {

        if (location.pathname === '/Regolamento') {
            usenavigate('/Regolamento');
        }
        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            usenavigate('/login');
        } else {

            loadcgallenge();
        }
    }, []);



    const loadcgallenge = () => {

        fetch(window.$produrl + "/challenge").then(res => {
            if (!res.ok) {
                console.log(res)
                // navigate('/');
                return false;
            }
            return res.json();
        }).then(res => {
            setchallenge(res);
        })


    }


    return (
        <div className="page-content">
            <div className="list cards-list inset margin-vertical-half no-chevron no-hairlines no-hairlines-between">
                <div className="row align-items-stretch">
                    {challenge &&
                        challenge.sort((a, b) => a.id < b.id ? 1 : -1).map((item, index) => (
                            <div style={{ border: '1px solid #cbc4c4', borderRadius: '10px' }} key={index + 1} className="col-100 small-50 xlarge-100">
                                <div className="item-content height-100">
                                    <div className="item-inner item-cell height-100 padding-vertical">
                                        <div className="item-row flex-direction-column height-100">
                                            <div className="item-row">
                                                <div className="item-cell flex-shrink-0 width-auto align-self-flex-start">
                                                    {item.status === 'pending' &&
                                                        <b style={{ background: '#e7e7e7', padding: '3px' }} >Attesa Avversario</b>

                                                    }
                                                    {item.status === 'processing' &&
                                                        <>
                                                            {item.datasfida === '' ? (
                                                                <b style={{ background: '#e7e7e7', padding: '3px' }}>Da Porgrammare</b>

                                                            ) : (
                                                               <b style={{ background: '#e7e7e7', padding: '3px' }}>In Corso</b>

                                                            )}
                                                        </>
                                                    }
                                                    {item.status === 'cancel' &&
                                                        <b style={{ background: '#e7e7e7', padding: '3px' }}>Annullata</b>

                                                    }
                                                    {item.status === 'complete' &&
                                                        <b style={{ background: '#e7e7e7', padding: '3px' }} >Completata </b>

                                                    }


                                                </div>
                                                <div className="item-cell">
                                                    <div style={{ position: 'relative', left: '-10px' }} className="item-row">
                                                        <div className="item-cell">
                                                            {item.title}
                                                        </div>
                                                        <div className="item-cell flex-shrink-0 width-auto line-height-1">
                                                            <span style={{ fontSize: "14px", textAlign: 'left' }}><b>Creata:</b> &nbsp; <i>{item.datacreate}</i></span>
                                                            <br></br>
                                                            <span style={{ fontSize: "14px", textAlign: 'left' }}><b>Prevista:</b> <i>{item.datasfida}</i></span>

                                                        </div>
                                                    </div>
                                                    <div className="item-row">
                                                        <div className="item-cell flex-shrink-0 width-auto line-height-1">


                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="item-row margin-top">
                                                <div style={{ textAlign: 'center', background: '#e7e7e7', opacity: '0.7' }} className="item-cell">
                                                    <div style={{borderRadius: '10px' }} className="font-size-14 multi-line-text lines-3 text-color-gray">
                                                        <ul>
                                                            <li> <a style={{ textTransform: 'capitalize' }} className='link' href={'/Challenge-single/' + item.players[0].idp1 + '/' + item.players[0].p1}>
                                                                <span style={{ fontSize: "14px" }}> <i>{item.players[0].p1} </i></span>
                                                            </a></li>
                                                            <li style={{ fontWeight: "bold" }}>      <span>vs</span></li>

                                                            <li>      <a style={{ textTransform: 'capitalize' }} className='link' href={'/Challenge-single/' + item.players[1].idp2 + '/' + item.players[1].p2}>
                                                                <span style={{ fontSize: "14px" }}> <i>{item.players[1].p2}</i></span>
                                                            </a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-contet">
                                                <div style={{ paddingRight: '0' }} className="block block-strong medium-hide no-hairlines no-margin-vertical sticky sticky-top">
                                                    <div style={{ padding: '5px 8px' }} className={item.status === 'pending' || item.status === 'processing' ? 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong-pending' : 'list no-chevron no-hairlines no-hairlines-between no-safe-areas segmented-strong'}>

                                                        <ul>

                                                            <li style={{ textAlign: 'center' }} ><b>Score</b></li>
                                                            <li style={{ textDecoration: item.set1 === '0-0' ? 'line-through' : 'none', textAlign: 'center' }} >Set1: <b>{item.set1} </b></li>
                                                            <li style={{ textDecoration: item.set2 === '0-0' ? 'line-through' : 'none', textAlign: 'center' }}>Set2: <b>{item.set2} </b></li>
                                                            <li style={{ textDecoration: item.set3 === '0-0' ? 'line-through' : 'none', textAlign: 'center' }} >Set3: <b>{item.set3} </b> </li>
                                                        </ul>

                                                    </div>

                                                    {/*    <span className="segmented-highlight"></span> */}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>


        </div>
    );
}

export default Home;
