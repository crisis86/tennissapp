import './assets/framework7-bundle.css';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import iconchallengeblu from './assets/icone/chhallenge-blu.svg';
import iconchallengered from './assets/icone/chhallenge-active.svg';
import iconchallenge from './assets/icone/chhallenge.svg';
import Report from './hooks/Report';

const ChallengeList = () => {
    const navigate = useNavigate();
    const iduser = parseInt(sessionStorage.getItem('iduser'))
    const club = sessionStorage.getItem('club');
    const myrole = sessionStorage.getItem('userrole')

    const [playerlist, playerupdt] = useState([]);
    const [mypos, setmypos] = useState(0)

    useEffect(() => {
        if (club === "" || club === undefined) {
            navigate('/login');
        } else { 
        
          
        // controllasfide()
        // controllpending();
        // controllafuorigioco()

        const cron = require('node-schedule')
        cron.scheduleJob('*/100 * * * *', () => {
          
           // controllasfide()
          //  controllpending();
          //  controllafuorigioco()

          //  console.log('running a task every 10min', new Date());
        });
    }
    }, [])


    useEffect(() => {
        if (club === "" || club === undefined) {
            navigate('/login');
        }

        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else {
            loadlistplayer();
        }


    }, []);

    useEffect(() => {
        if (club === "" || club === undefined) {
            navigate('/login');
        } else {
            getmyposition();
        }
    }, [iduser])


    function getmyposition()  {

        if(myrole==='player') { 
        fetch(window.$produrl + "/user?role=player&codiceclub=" + club+"&id="+iduser).then(res => {
            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(res => {
            
            //console.log(datax);
            setmypos(res[0].posizione);
          // console.log(res[0].posizione);
        });

    }
    }

    const loadlistplayer = () => {
        fetch(window.$produrl + "/user?role=player&codiceclub=" + club).then(res => {
            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(res => {

            let datax = res;
            datax.sort(function (a, b) {
                if (a > b) return 1
                if (b < a) return -1
                return 0
            });

            //console.log(datax);
            playerupdt(datax);
            //console.log(playerupdt);
        });
    }

    return (
        <div className="page">
            <div className="tabs-swipeable-wrap">
                <div className="tabs">
                    <div className="page-content tab tab-active">
                        <div className="row justify-content-center">
                            <div style={{ paddingLeft: '0', paddingRight: '0' }} className="col-100 medium-75 large-60 xlarge-50">
                                <div className="list inset margin-vertical">
                                    <ul>
                                        {playerlist &&
                                            playerlist.sort((a, b) => a.posizione > b.posizione ? 1 : -1).map((item, index) => (
                                                <li style={{ borderRadius: '30px' }} key={index + 1} className={item.id === iduser ? 'my-rank me' : 'my-rank'}>
                                                    <div style={{ borderRadius: '30px', background: item.insfida ? 'rgba(220,81,59,0.9)' : '', fontWeight: item.insfida ? 'bold' : '500' }} className="item-content">
                                                        <div className="item-inner item-cell">
                                                            <div className="item-row">
                                                                <div className="item-cell width-auto">
                                                                    <div style={{ minWidth: '20px' }} className="classifica font-size-18 font-weight-bold text-color-bluegray">{item.posizione}</div>
                                                                </div>
                                                                <a className='link' style={{ width: '170px' }} href={'/Challenge-single/' + item.id + '/' + item.name}>

                                                                    <div style={{ fontSize: '15px', textTransform: 'capitalize' }} className="item-cell">
                                                                        <div style={{ color: myrole==='player' && item.insfida===false && item.posizione + 1 > mypos || item.posizione + 8 < mypos ? '#013777': '#afb72f'}} className="font-size-20 font-weight-bold text-color-primary">

                                                                            {item.name}

                                                                        </div>

                                                                        {item.id === iduser ? (
                                                                            <div className="country font-size-14 text-color-gray">{item.country}</div>

                                                                        ) : (
                                                                            <>
                                                                                {item.fuorigioco === false ? (
                                                                                    <div className="country font-size-14 text-color-gray">{item.insfida ? 'Non Sfidabile' : 'Sfidabile'}</div>
                                                                                ) : (
                                                                                    <div className="country font-size-14 text-color-red"><b>FUORIGIOCO</b></div>

                                                                                )}
                                                                            </>
                                                                        )}

                                                                    </div>
                                                                </a>
                                                                <Report name={item.name} id={item.id} view="list" ></Report>
                                                                <div className="item-cell flex-shrink-0 width-auto">
                                                                    {item.fuorigioco ? (

                                                                        <img src={iconchallengered} height="30" width="30" alt="Challenge" />
                                                                    ) : (
                                                                        <img src={myrole==='player' && item.insfida===false && item.posizione + 1 > mypos || item.posizione + 8 < mypos ? iconchallengeblu: iconchallenge} height="30" width="30" alt="Challenge" />
                                                                    )}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChallengeList;