import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Report = (props) => {

    const club = sessionStorage.getItem('club')
    const param = useParams()
    const [percentage, setpercentage] = useState(0)
    const [winlabel, setwinlabel] = useState(true)
    const [widht, setwidht] = useState(70)
    const [height, setheight] = useState(70)

    useEffect(() => {

       
        if(props !==undefined) {
         
            splittarisultatiByprops(props.name,props.id);

            if (props.view==="list") {
                setwinlabel(false)
                setwidht(45)
                setheight(45)
            }else {
                setwinlabel(true)
                setwidht(70)
                setheight(70)
            }
         
        }  

    }, [])
    function splittarisultatiByprops(name,idpd) {

        fetch(window.$produrl + "/challenge?codiceclub="+club+"&status=complete&q=" + name, {
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
       
            let sommavittorie = 0
            let lunghezza = 0;
            let percentuale = 0;
            const idscheda = parseInt(idpd)

            const found = challengelist.filter(obj => {
                if(obj.finalplayer === parseInt(idpd)) {
                    sommavittorie+=1
                }
                lunghezza = Object.keys(challengelist).length           

                return obj.id;

            });

            percentuale = sommavittorie / lunghezza * 100

            if (isNaN(percentuale)) {
                percentuale = 0;
            }
          
            setpercentage(Math.round(percentuale))


        });
    }
    
    return (
        <>
            <div style={{ width: widht, height: height }}>

                <CircularProgressbar
                    styles={buildStyles({
                        textColor: "#0054b4",

                    })}
                    minValue={0} maxValue={100} value={percentage}  text={`${percentage}%`} />

            </div>
            { winlabel &&
            <span style={{ color: '#0054b4', fontSize: '14px', paddingLeft: '5px' }}>WIN</span>
             }
        </>
    );
}


export default Report;