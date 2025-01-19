import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import up from '../assets/icone/up.png';
import down from '../assets/icone/down.png';
import neu from '../assets/icone/neu.png';

const Report = (props) => {

    const club = sessionStorage.getItem('club')
    const param = useParams()
    const [percentage, setpercentage] = useState(0)
    const [winlabel, setwinlabel] = useState(true)
    const [widht, setwidht] = useState(70)
    const [height, setheight] = useState(70)
    const [lastesito, selastesito] = useState(0)


    useEffect(() => {


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

        fetch(window.$produrl + "/challenge?codiceclub=" + club + "&status=complete&q=" + name, {
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
            const idscheda = parseInt(idpd)

            const found = challengelist.filter(obj => {
                if (obj.finalplayer === parseInt(idpd)) {
                    sommavittorie += 1
                  
                }
                esitoultimoincontro = obj.finalplayer
                lunghezza = Object.keys(challengelist).length

                return obj.id;

            });

            percentuale = sommavittorie / lunghezza * 100

            if (isNaN(percentuale)) {
                percentuale = 0;
            }

            setpercentage(Math.round(percentuale))
            selastesito(esitoultimoincontro)

        });
    }
     
    return (
        <>
        <div>
        {lastesito === 0 && 
         <span style={{position:'relative', top:'8px', right:'10px'}}> <img src={neu}></img></span>
           
         }
         {lastesito === props.id && 
        <span style={{position:'relative', top:'8px', right:'10px'}}>  <img src={up}></img></span>
           
         }
          {lastesito != props.id && lastesito !=0 &&
           <span style={{position:'relative', top:'8px', right:'10px'}}>  <img src={down}></img></span>
          }
         </div>
            <div style={{textAlign:'center', width: widht, height: height }}>

                <CircularProgressbar
                
                    styles={buildStyles({
                        textColor: "#0054b4",
                        pathColor: "#0054b4",
                        trailColor: "gold"
              

                    })}
                    minValue={0} maxValue={100} value={percentage}  text={`${percentage}%`} >

                    </CircularProgressbar>
      
                    {winlabel===false &&
            <div style={{ fontWeight:'500', color:'#0054b4', fontSize: 8, marginTop: -18 }}>
             WIN
            </div>
 }

            </div>
            {winlabel &&
                <span style={{ color: '#0054b4', fontSize: '15px', paddingLeft: '5px' }}>WIN</span>
            }
        </>
    );
}


export default Report;