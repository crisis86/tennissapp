import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Report = () => {


    const param = useParams()
    const [percentage, setpercentage] = useState(0)


    useEffect(() => {

        splittarisultati();

    }, [])

    function splittarisultati() {

        fetch(window.$produrl + "/challenge?status=complete&q=" + param['name'], {
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
            const idscheda = parseInt(param['id'])

            const found = challengelist.filter(obj => {
                if(obj.finalplayer === parseInt(param['id'])) {
                    sommavittorie+=1
                }
                lunghezza = Object.keys(challengelist).length           

                return obj.id;

            });

            percentuale = sommavittorie / lunghezza * 100

            if (isNaN(percentuale)) {
                percentuale = 0;
            }
          
            setpercentage(percentuale)


        });
    }

    return (
        <>
            <div style={{ width: 70, height: 70 }}>

                <CircularProgressbar
                    styles={buildStyles({
                        textColor: "#0054b4",

                    })}
                    minValue={0} maxValue={100} value={percentage} text={`${percentage}%`} />

            </div>
            <span style={{ color: '#0054b4', fontSize: '14px', paddingLeft: '5px' }}>WIN</span>
        </>
    );
}


export default Report;