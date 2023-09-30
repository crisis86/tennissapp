

const Regolamento = () => {
    return (
        <div className="page-content regolamento">
            <br />
            <h1> Regolamento</h1>
            <div className="left">
                <a href="/" className="link back">
                    <i className="icon icon-back"></i>
                    <span className="if-not-md">Home</span>
                </a>
            </div>
            <p><strong><u>PUOI LANCIARE UNA SFIDA</u></strong> <br /></p>
            <p>- Puoi sfidare uno degli 8 partecipanti che ti precedono , obbligo dello sfidato sarà di accettare la sfida entro 24 ore, Obbligo di entrambi sarà di inserire la data di disputa del match entro le complessive 48 ore dalla sfida.Obbligo di entrambi sarà disputare il match entro 8 giorni, tutte le scadenze si intendono decorrenti dal momento esatto in cui la sfida è stata lanciata</p>
            <p>- Se hai sfidato e vinci: prendi il posto dello sfidato mentre lo sfidato perderà una posizione in classifica</p>
            <p>- Se hai sfidato e perdi: perdi 1 posizioni in classifica mentre lo sfidato guadagnerà 2 posizioni in classifica (tranne che lo sfidato non sia già secondo perché per diventare numero 1 occorre battere il campione in carica, o attendere un suo forfait)</p>
            <p>- Terminato il match, se hai lanciato una sfida per 48 ore sarai “solo sfidabile”, ovvero non potrai lanciare alcuna sfida ma potrai essere solo sfidato, 48 ore si intendono a partire dall’inserimento del risultato e aggiornamento classifica.</p>
            <p>- Puoi lanciare un numero illimitato di sfide al mese - non potrai sfidare lo stesso avversario appena sfidato, se non dopo che entrambi abbiate giocato ciascuno con un avversario diverso</p>
            <p>- In caso di indisponibilità a partecipare alla sfide potrai usufruire dello Status FUORIGIOCO senza limiti di tempo, ma ogni 6 giorni di Status FUORIGIOCO prevende una penalità</p>

            <p><strong><u>PUOI ESSERE SFIDATO</u></strong>&nbsp;<br /></p>
            <p>- Puoi essere sfidato da uno degli 8 che ti seguono, obbligo dello sfidato sarà di accettare la sfida entro 24 ore,</p>
            <p>- Se sei stato sfidato e vinci: guadagnerai 2 posizioni in classifica (tranne che tu non sia già secondo perché per diventare numero 1 occorre battere il campione in carica, o attendere un suo forfait) mentre lo sfidante perde 2 posizioni in classifica</p>
            <p>- Se sei stato sfidato e perdi: perdi una posizione in classifica mentre lo sfidante prenderà la tua posizione -ultimato il match</p>
            <p>- Puoi ricevere un numero illimitato di sfide al mese - non potrai essere sfidato dallo stesso avversario che ti ha appena sfidato, se non dopo che entrambi abbiate giocato ciascuno con un avversario diverso </p>

            <p><strong><u>REGOLE OPERATIVE:</u></strong>&nbsp;<br /></p>
            <p>- Si gioca al meglio di 2 set su 3 con tiebreak, oppure 1 set a 9.Al posto del terzo set si gioca un super tie break a 10, ma solo col consenso di entrambi e se c’è tempo utile</p>
            <p>- Si tenga conto che hanno priorità le prenotazioni già attive sui campi, ovvero da parte di altri giocatori della League che potrebbero concedere qualche minuto, oppure di gente estranea alla League che non avranno voglia di concedere tempo, o ancora più importante da parte della scuola tennis (il campo va liberato 1 secondo prima e non 1 secondo dopo, in quanto l’attività concordata tra maestri e genitori non può essere modificata per interessi estranei alla scuola stessa)</p>
            <p><strong>- Per quanto sopra, allo scadere del tempo prenotato, o in caso di pioggia, o se il campo è impegnato vale il risultato acquisito, e precisamente:</strong></p>
            <p>- Se si è scelto di giocare con set a 9, vince chi è in vantaggio con il numero di game.</p>
            <p>- Se si è completato un set ed è in corso il secondo, vince chi è già in vantaggio di un set</p>
            <p>- Se si è completato anche il secondo set senza iniziare il terzo varrà la differenza game, se anche questa è pari vince chi ha vinto un set 7-5</p>
            <p>- Se è in corso il terzo set o il super tie, vince chi è in vantaggio, ed in caso di assoluta parità varrà la differenza game</p>
            <p>- Solo in caso di assoluta parità per i casi precedenti la partita si concluderà con un nulla di fatto mantenendo ciascuno la propria posizione ed essendo immune lo sfidato e solo sfidabile lo sfidante per le successive 48 ore </p>

            <p><strong><u>PENALITÀ ( per qualsiasi anomalia sulle penalità non abbiate fretta, ci contattate e risolviamo in 24h):</u></strong>&nbsp;<br /></p>
            <p>- Se rinunci alla sfida perdi 1 posizione e per 48 ore sarai solo sfidabile mentre l'avversario guadagna 1 posizione</p>
            <p>- Se da sfidato non accetti la sfida entro 24 ore dal lancio della stessa perdi 1 posizione e per 48 ore sarai solo sfidabile mentre l’avversario guadagna 1 posizione</p>
            <p>- Se lo sfidato o lo sfidante non inseriscono in calendario la sfida entro 48 ore ore dal lancio della stessa saranno penalizzato di 1 posizione entrambi</p>
            <p>- Se il giocatore resta in Status FUORIGIOCO per oltre 6 giorni perde una posizione in classifica</p>
            <p>- Se dopo aver lanciato una sfida non vi è compatibilità di orario potrete contattare il Presidente che deciderà se annullare la sfida con o senza penalità per uno o per entrambi, in caso di non penalità verrà ripristinato lo status preesistente di immune o sfidabile</p>
            <p>- Non vi è penalità se la sfida non può giocarsi per impraticabilità di campo, nel qual caso va rigiocata entro 3 giorni, e così ad oltranza</p>
            <p><strong>- Il Presidente può assegnare delle penalità, ovvero posizioni in classifica, qualora sussistano le condizioni di antisportività, mancato rispetto, o forzatura volontaria delle funzionalità della App</strong> </p>


        </div>
    );
}

export default Regolamento;

