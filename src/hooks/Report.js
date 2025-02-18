import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import up from '../assets/icone/up.png';
import down from '../assets/icone/down.png';
import neu from '../assets/icone/neu.png';

const Report = (props) => {

    const club = sessionStorage.getItem('club')
    const location = useLocation();
    const param = useParams()
    const [percentage, setpercentage] = useState(0)
    const [winlabel, setwinlabel] = useState(true)
    const [widht, setwidht] = useState(70)
    const [height, setheight] = useState(70)
    const [lastesito, selastesito] = useState(0)
    const [lastyperdita, setlastyperdita] = useState(0)

    const [displayfreccia, setdisplayfreccia] = useState('block')


    useEffect(() => {


        if (location.pathname.includes('Challenge-single')) {
            setdisplayfreccia('block'); //nascondo le frecce icone nella scheda singola giocatore
        }

        if (props !== undefined) {

            splittarisultatiByprops(props.name, props.id);

            if (props.view === "list") {
                setwinlabel(false)
                setwidht(48)
                setheight(48)
            } else {
                setwinlabel(true)
                setwidht(70)
                setheight(70)
            }

        }

    }, [])
    function splittarisultatiByprops(name, idpd) {

        fetch(window.$produrl + "/challenge?codiceclub=" + club + "&status=complete&status=cancel&q=" + name + "&_sort=id,datasfida&_order=desc", {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        }).then(res => {
            if (!res.ok) {
                // console.log('nulla')
                return false
            }
            return res.json();
        }).then(resp => {

            let challengelist = resp

            let sommavittorie = 0;
            let lunghezza = 0;
            let percentuale = 0;
            let esitoultimoincontro = 0;
            let esitoultimaperdita = 0;
            const idscheda = parseInt(idpd)


            const found = challengelist.filter(obj => {

                if (obj.status === 'complete') { // mi l'ultimo evento controllo lo stato
                    esitoultimoincontro = challengelist[0].finalplayer  // prendo l'id del vincitore dell'ultimo evento complete
                    lunghezza+=1
                }

                if(esitoultimoincontro ===0) {
                if (obj.status === 'cancel' && obj.finalplayer === parseInt(idpd)) { //se ho annullato io 


                    esitoultimaperdita = obj.finalplayer
                 //   console.log("primo else if")

                } else if (obj.status === 'cancel' && obj.finalplayer != parseInt(idpd) && obj.finalplayer != null) { //se annulla l'avversario
                   if(esitoultimaperdita===0) { 
                    esitoultimoincontro = idpd
                   // console.log("secondo else if" + esitoultimaperdita)
                   }
                } else {
                    esitoultimaperdita = idpd // se annullato automaticamente imposto il mio id
                    //console.log("entro finale")


                }
            }


                if (obj.status === 'complete' && obj.finalplayer === parseInt(idpd)) {
                    sommavittorie += 1
                    console.log('sommavittorie ' + sommavittorie)
                }
               // lunghezza = Object.keys(challengelist).length
                return obj.id;

            });

            //fuori const found

            percentuale = sommavittorie / lunghezza * 100

            if (isNaN(percentuale)) {
                percentuale = 0;
            }

            setpercentage(Math.round(percentuale))
            selastesito(esitoultimoincontro)
            setlastyperdita(esitoultimaperdita)

        });
    }

    return (
        <>
            <div style={{ display: displayfreccia }}>
                {lastesito === 0 && lastyperdita != props.id &&

                    <span style={{ position: 'relative', top: '8px', right: '10px' }}> <img src={neu}></img></span>

                }
                {lastesito === props.id &&
                    <span style={{ position: 'relative', top: '8px', right: '10px' }}>  <img src={up}></img></span>

                }
                {lastesito != props.id && lastesito != 0 && lastyperdita != props.id &&
                    <span style={{ position: 'relative', top: '8px', right: '10px' }}>  <img src={down}></img></span>
                }
                {lastyperdita === props.id && lastesito !== props.id &&
                    <span style={{ position: 'relative', top: '8px', right: '10px' }}>  <img src={down}></img></span>
                }

            </div>
            <div style={{ textAlign: 'center', width: widht, height: height }}>

                <CircularProgressbar

                    styles={buildStyles({
                        textColor: "#013777",
                        pathColor: "#013777",
                        trailColor: "#f0de46"


                    })}
                    minValue={0} maxValue={100} value={percentage} text={`${percentage}%`} >

                </CircularProgressbar>

                {winlabel === false &&
                    <div style={{ fontWeight: '500', color: '#013777', fontSize: 8, marginTop: -18 }}>
                        WIN
                    </div>
                }

            </div>
            {winlabel &&
                <span style={{ color: '#013777', fontSize: '15px', paddingLeft: '5px' }}>WIN</span>
            }
        </>
    );
}


export default Report;