

import React from "react";
import "./assets/presentation.css"; // File CSS per lo stile
import imagehero from './assets/images/image-hero.jpg';
import fightimage from './assets/images/fight-image.png';
import comunytimg from './assets/images/community-image.png';
import padelimg from './assets/images/padel-image.png';
import iconcomunyt from './assets/images/icon-community.png';
import iconcalendar from './assets/images/icon-calendar.png';
import icontrophy from './assets/images/icon-trophy.png';


const Presetation = () => {

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
         <h1>Benvenuto su <span>SpinUp TENNIS</span></h1>
        <p>La piattaforma perfetta per organizzare e monitorare le tue sfide di tennis e padel.</p>
        <a href="/register" className="cta-button">Registrati</a>
      </section>

      {/* Sezioni Tematiche */}
      <section className="sections">
        {/* Primo blocco: immagine a sinistra */}
        <div className="section">
          <img src={fightimage} alt="Fight" className="section-image" />
          <div className="section-content">
            <h2>Sfide in tempo reale</h2>
            <p>Monitora le partite e sfida altri giocatori ovunque tu sia.</p>

          </div>
        </div>

        {/* Secondo blocco: immagine a destra */}
        <div className="section reverse">

          <img src={padelimg} alt="Padel" className="section-image" />
          <div className="section-content">
            <h2>Non solo tennis</h2>
            <p>Pianifica le tue sfide e ricevi notifiche sui prossimi incontri.</p>
          </div>
        </div>

        {/* Terzo blocco: immagine a sinistra */}
        <div className="section">
          <img src={comunytimg} alt="Community" className="section-image" />
          <div className="section-content">
            <h2>Community Attiva</h2>
            <p>Connettiti con altri appassionati e migliora il tuo gioco.</p>
          </div>
        </div>
      </section>

      {/* Box Value Proposition */}
      <section className="value-propositions">
        <div className="value-box">
          <h3>Tennis e Padel </h3>
          <br></br>
          <img style={{ width: '60px' }} src={icontrophy} alt="SpinUp TENNIS" className="logo" />

        </div>
        <div className="value-box">

          <h3>Calendario Eventi</h3>
          <br></br>
          <p>  <img style={{ width: '60px' }} src={iconcalendar} alt="SpinUp TENNIS" className="logo" />
          </p>
        </div>
        <div className="value-box">
          <h3>Sport Comunity</h3>
          <br></br>
          <img style={{ width: '60px' }} src={iconcomunyt} alt="SpinUp TENNIS" className="logo" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Email: <a style={{ color: 'white !important' }} href="mailto:info@spinuptennis.it" className="footer-link">info@spinuptennis.it</a></p>

        <p>© 2025 TennisApp – Tutti i diritti riservati</p>

      </footer>
    </div>
  );
};


export default Presetation;