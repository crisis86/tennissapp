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
            let vitcasa = 0
            let vitospite = 0
            let vincitore = ""
            let sommavittorie = 0
            let sommasconfitte = 0
            let lunghezza = 0;
            let percentuale = 0;
            const idscheda = parseInt(param['id'])

            const found = challengelist.filter(obj => {
                lunghezza = Object.keys(challengelist).length
                let splitresult1 = obj.set1.split('-')
                let splitresult2 = obj.set2.split('-')
                let splitresult3 = obj.set3.split('-')

                if (splitresult1[0] > splitresult1[1]) {
                    vitcasa += 1
                } else {
                    vitospite += 1
                }

                if (obj.set2 !== '0-0') {
                    if (splitresult2[0] > splitresult2[1]) {
                        vitcasa += 1
                    } else {
                        vitospite += 1
                    }
                }
                if (obj.set3 !== '0-0') {
                    if (splitresult3[0] > splitresult3[1]) {
                        vitcasa += 1
                    } else {
                        vitospite += 1
                    }
                }

                if (vitcasa > vitospite) {
                    vincitore = "Player1"
                } else {
                    vincitore = "Player2"

                }


                if (vincitore === 'Player1') {
                    if (obj.players[0].idp1 === idscheda) {

                        sommavittorie += 1
                    } else {

                        sommasconfitte += 1

                    }
                }

                if (vincitore === 'Player2') {
                    if (obj.players[1].idp2 === idscheda) {

                        sommavittorie += 1
                    } else {
                        sommasconfitte += 1

                    }
                }

                return obj.id;

            });

            percentuale = sommavittorie / lunghezza * 100

            if (isNaN(percentuale)) {
                percentuale = 0;
            }
              console.log(vitcasa)
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