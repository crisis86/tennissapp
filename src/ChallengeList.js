import './assets/framework7-bundle.css';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from './assets/pallina.png';


const ChallengeList = () => {
    const navigate = useNavigate();
const iduser = parseInt(sessionStorage.getItem('iduser'))

    const [playerlist, playerupdt] = useState([]);



    useEffect(() => {
        let email = sessionStorage.getItem('email')

        if (email === '' || email === null) {
            //toast.error('Not Authenticate session');
            navigate('/login');
        } else{
            loadlistplayer();
        }
     

    }, []);

    const loadlistplayer = () => {
        fetch(window.$produrl+"/user?role=player").then(res => {
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
                            <div style={{paddingLeft:'0', paddingRight:'0'}} className="col-100 medium-75 large-60 xlarge-50">
                                <div className="list inset margin-vertical">
                                    <ul>
                                        {playerlist &&
                                            playerlist.sort((a, b) => a.posizione > b.posizione ? 1 : -1).map((item, index) => (
                                               <li style={{borderRadius:'30px'}} key={index + 1} className= {item.id === iduser ? 'my-rank me' : 'my-rank' }>
                                                    <div style={{background: item.insfida ? '#fb8438':'', fontWeight: item.insfida ? 'bold' : '500'}} className="item-content">
                                                        <div className="item-inner item-cell">
                                                            <div className="item-row">
                                                       
                                                              <div className="item-cell width-auto">
                                                                    <img src={logo} height="20" width="20" alt="Pallina" />
                                                                </div>
                                                                <a className='link' style={{ width: '150px' }} href={'/Challenge-single/' + item.id+'/'+item.name}>

                                                                    <div className="item-cell">
                                                                            <div className="font-size-20 font-weight-bold text-color-primary">

                                                                                {item.name}

                                                                            </div>
                                                                    
                                                                       {item.id === iduser ? (
                                                                        <div className="country font-size-14 text-color-gray">{item.country}</div>

                                                                       ):(
                                                                        <div  className="country font-size-14 text-color-gray">{item.insfida  ? 'Non Sfidabile' : 'Sfidabile'}</div>

                                                                       )} 

                                                                    </div>
                                                                </a>
                                                                
                                                                <div className="item-cell flex-shrink-0 width-auto">
                                                                    <div className="classifica font-size-18 font-weight-bold text-color-bluegray">{item.posizione}</div>
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