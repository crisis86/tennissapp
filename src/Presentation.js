

import React from "react";
import "./assets/presentation.css"; // File CSS per lo stile

const Presetation = () => {

    return (
        <div className="landing-container">
        {/* Hero Section */}
        <header className="hero">
          <div className="hero-content">
            <h1>Benvenuto su <span className="highlight">TennisApp</span></h1>
            <p>La piattaforma perfetta per organizzare e monitorare le tue sfide di tennis.</p>
            <a href="/register" className="cta-button">Registrati Ora</a>
          </div>
          <img src="/tennis-hero.jpg" alt="Giocatori di tennis" className="hero-image" />
        </header>
  
        {/* Sezione Vantaggi */}
        <section className="features">
          <div className="feature">
            <h2>🏆 Sfide in tempo reale</h2>
            <p>Monitora le partite e sfida altri giocatori ovunque tu sia.</p>
          </div>
          <div className="feature">
            <h2>📅 Calendario Eventi</h2>
            <p>Pianifica le tue sfide e ricevi notifiche sui prossimi incontri.</p>
          </div>
          <div className="feature">
            <h2>💬 Community Attiva</h2>
            <p>Connettiti con altri appassionati e migliora il tuo gioco.</p>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} TennisApp - Tutti i diritti riservati</p>
        </footer>
      </div>
    );
  };


export default Presetation;