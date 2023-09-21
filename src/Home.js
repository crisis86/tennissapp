import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import iconafiltro from './assets/icone/filter.png';
import pallina from './assets/pallina.png';
import dayjs from 'dayjs';
import 'dayjs/locale/it' // load on demand
import iconpost from './assets/icone/post.svg';

const Home = () => {
    const customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.locale('it')
    dayjs.extend(customParseFormat)

    const usenavigate = useNavigate();
    const [challenge, setchallenge] = useState([]);
    const location = useLocation();
    const [filter, setfilterchange] = useState('vuoto');
    const [today, setday] = useState(new Date())
    const [numberpost, setnumberpost] = useState(0);

    useEffect(() => {

        if (location.pathname === '/Regolamento') {
            usenavigate('/Regolamento');
        }
        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            usenavigate('/login');
        } else {

            if (filter === 'all' || filter === 'vuoto') {
                loadcgallenge();
            } else {
                loadcgallengeByFilter(filter);

            }
        }
        countpost();

    }, []);



    useEffect(() => {
        if (filter === 'all' || filter === 'vuoto') {
            loadcgallenge();
        } else {
            loadcgallengeByFilter(filter);
        }

    }, [filter]);

    const countpost = () => {

        fetch(window.$produrl + "/post").then(res => {
            if (!res.ok) {
                console.log(res)
                // navigate('/');
                return false;
            }
            return res.json();
        }).then(resp => {
            let  lunghezza = Object.keys(resp).length

            setnumberpost(lunghezza);
        })
    }

    const loadcgallengeByFilter = (filro) => {

        fetch(window.$produrl + "/challenge?status=" + filro).then(res => {
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

    const loadcgallenge = () => {

        fetch(window.$produrl + "/challenge").then(res => {
            if (!res.ok) {
                console.log(res)
                // navigate('/');
                return false;
            }
            return res.json();
        }).then(resp => {

            setchallenge(resp);
        })


    }

    function formatdate(data) {
        let formattedDate = dayjs().format(data) // 2023-03-01
        //   console.log(formattedDate)
        return formattedDate
    }

    return (
        <div className="page-content">
            <div className="list cards-list inset margin-vertical-half no-chevron no-hairlines no-hairlines-between">

                <div style={{display:'flex'}} className="filter">

                    <img style={{ float: 'left' }} src={iconafiltro} alt="filter" width={23} ></img>

                    <select style={{ margin: '0 10px', width: '65%', padding: '2px 0', background: '#f9f9f9' }} className="form-control select input-outline" selected="selected" value={filter} onChange={e => setfilterchange(e.target.value)} >
                        <option disabled className="md item-input-invalid select" style={{ color: 'grey' }} value='vuoto'>Seleziona Stato Evento</option>
                        <option value='all'>Tutti Gli Stati</option>
                        <option value='processing'>In Corso</option>
                        <option value='cancel'>Annullate</option>
                        <option value='processing&datasfida='>Da Programmare</option>
                        <option value='pending'>Attesa Avversario</option>
                        <option value='complete'>Completate</option>

                    </select>
                    <span style={{float:'right', color:'#71b852'}} ><a style={{color:'#71b852'}} href="/post"><img width={22} alt="post" src={iconpost}></img> <b>({numberpost})</b> </a></span>
                   
                </div>
                <div className="row align-items-stretch">
                    {challenge &&
                        challenge.sort((a, b) => a.status <= b.status ? 1 : -1).map((item, index) => (
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
                                                                <b style={{ background: '#e7e7e7', color:'#f47f35', padding: '3px' }}>Da Porgrammare</b>

                                                            ) : (
                                                                <b style={{ background: '#e7e7e7', color:'#f47f35', padding: '3px' }}>In Corso</b>

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
                                                            <span style={{ color: dayjs(today).format('DD/MM/YYYY') === formatdate(item.datasfida) ? '#f47f35':'none', fontSize: "14px", textAlign: 'left' }}><b>Prevista:</b> <i>{item.datasfida}</i></span>

                                                        </div>
                                                    </div>
                                                    <div className="item-row">
                                                        <div className="item-cell flex-shrink-0 width-auto line-height-1">


                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="item-row margin-top">
                                                <div style={{ borderRadius: '10px', textAlign: 'center', background: '#e7e7e7', opacity: '0.7' }} className="item-cell">
                                                    <div className="font-size-14 multi-line-text lines-3 text-color-gray">
                                                        <ul>
                                                            <li> <a style={{ textTransform: 'capitalize' }} className='link' href={'/Challenge-single/' + item.players[0].idp1 + '/' + item.players[0].p1}>
                                                                <span style={{ fontSize: "14px" }}> <i>{item.players[0].p1}</i>
                                                                {dayjs(today).format('DD/MM/YYYY') === formatdate(item.datasfida) &&
                                                                <i><img width={15} src={pallina} alt="Challenge1"></img></i>
                                                                }
                                                                </span>
                                                            </a></li>
                                                            <li style={{ fontWeight: "bold" }}>      <span>vs</span>
                                                               
                                                                {/*  {dayjs(today).format('DD/MM/YYYY')} - {formatdate(item.datasfida)} */}
                                                            </li>

                                                            <li>  <a style={{ textTransform: 'capitalize' }} className='link' href={'/Challenge-single/' + item.players[1].idp2 + '/' + item.players[1].p2}>
                                                                <span style={{ fontSize: "14px" }}> <i>{item.players[1].p2}</i>
                                                                {dayjs(today).format('DD/MM/YYYY') === formatdate(item.datasfida) &&
                                                                <i><img width={15} src={pallina} alt="Challenge2"></img></i>
                                                                }
                                                                </span>
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
