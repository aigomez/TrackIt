import * as serviceWorker from './serviceWorker';
import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import { AnimatedSwitch  } from 'react-router-transition';
import cookie from 'react-cookies'
import Typist from 'react-typist';
import { Digital } from 'react-activity';
import { Waypoint } from 'react-waypoint';
import BackToTop from "react-back-to-top-button";

import Peliculas from './Components/Header/Count/Peliculas'
import Series from './Components/Header/Count/Series'
import VerDespues from './Components/Header/Count/VerDespues'

import Header from './Components/Header/Header';
import Busqueda from './Components/Header/Sort/Busqueda';
import Filtros from './Components/Header/Sort/Filtros';

import Join from './Components/Modals/Join';
import Login from './Components/Modals/Login';
import LogOut from './Components/Main/User/LogOut';

import Biblioteca from './Components/Main/Biblioteca';
import Favoritos from './Components/Main/Favoritos';

import './Components/Styles/Globals.css';
import './Components/Styles/Header.css';
import './Components/Styles/Main.css';
import './Components/Styles/Modals.css';
import 'react-typist/dist/Typist.css';
import 'react-activity/dist/react-activity.css';

class Index extends React.Component {
  constructor() {
    super();
    this.state = { tokenSitio: cookie.load('tokenSitio') || '', isLoading: true };

    this.PeliculasRef = React.createRef();
    this.SeriesRef = React.createRef();
    this.VerDespsRef = React.createRef();
  }

  isLogged(tokenSitio) { this.setState({ tokenSitio: cookie.load('tokenSitio') || '' }) }
  Filtros(filtro) { this.setState({ filtro: filtro }) }
  Busqueda(busqueda) { this.setState({ busqueda: busqueda }) }

  sumCount(type) {
    if (type === 'movie') { this.PeliculasRef.current.sumPeliculas() }
    if (type === 'series') { this.SeriesRef.current.sumSeries() }
    if (type === 'Ver Despues') { this.VerDespsRef.current.sumVerDesps() }
  }

  delCount(type) {
    if (type === 'movie') { this.PeliculasRef.current.delPeliculas() }
    if (type === 'series') { this.SeriesRef.current.delSeries() }
    if (type === 'Ver Despues') { this.VerDespsRef.current.delVerDesps() }
  }

  render() {
    return (
      <BrowserRouter>
        <Route path = "/">
          {
            this.state.isLoading === true ?
              <div className = "loading-img"><Digital /></div> : null
          }

          <div className = "wall">
            {
              this.state.tokenSitio === ''?
                <div className = "btns-user in-line">
                  <Login isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />
                </div>
                :
                <div className = "btns-user in-line">
                  <LogOut isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />
                </div>
            }

            <img src = { require('./Components/Imgs/Wall3.jpg') } onLoad = { () => this.setState({ isLoading: false }) } alt = ""/>

            <Typist className = "title in-line" cursor = {{ hideWhenDone: true, hideWhenDoneDelay: 100 }}>
              Track It
            </Typist>

            <Typist className = "slogan in-line" avgTypingDelay = {45} startDelay = {1000} cursor = {{ hideWhenDone: true, hideWhenDoneDelay: 100 }}>
              Descubrí y puntuá tu contenido favorito!
            </Typist>

            {
              this.state.tokenSitio === ''?
                <div className = "center in-line">
                  <Join isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />
                </div>
              :
                <div></div>
            }
          </div>

          <div className = "count">
            <Peliculas tokenSitio = { this.state.tokenSitio || '' } ref = {this.PeliculasRef} />
            <Series tokenSitio = { this.state.tokenSitio || '' } ref = {this.SeriesRef} />
            <VerDespues tokenSitio = { this.state.tokenSitio || '' } ref = {this.VerDespsRef} />
          </div>

          <Waypoint
            onEnter = {() => this.setState({ bgColor: false })}
            onLeave = {() => this.setState({ bgColor: true })}
          />

          <div className = {(this.state.bgColor === true? "stickyColor transition-in" : "transition-out")}>
            <div className = 'header'>
              <Filtros filtro = {(filtro) => this.Filtros(filtro)} />
              <Header />
              <Busqueda busqueda = {(busqueda) => this.Busqueda(busqueda)} />
            </div>
          </div>
        </Route>

        <AnimatedSwitch
          atEnter={{ opacity: 0, foo: 0 }}
          atLeave={{ opacity: 0, foo: 2 }}
          atActive={{ opacity: 1, foo: 1 }}
          mapStyles={(styles) => {
            return {
                position: (styles.foo <= 1) ? 'relative': 'absolute',
                width: '100%',
                height: '100%',
                opacity: styles.opacity
            }
          }}
        >
          <Route path = "/" exact>
            <Biblioteca
              tokenSitio = { this.state.tokenSitio || '' }
              filtro = { this.state.filtro || 'Nombre A - Z/sinElegir/sinElegir' }
              busqueda = { this.state.busqueda || ''}
              sumCount = {(type) => this.sumCount(type)} />
          </Route>

          <Route path = "/favoritos" exact>
            <Favoritos
              tokenSitio = { this.state.tokenSitio || '' }
              filtro = { this.state.filtro || 'Nombre A - Z/sinElegir/sinElegir' }
              busqueda = { this.state.busqueda || '' }
              delCount = {(type) => this.delCount(type)} />
          </Route>
        </AnimatedSwitch>

        <Route path = "/">
          <BackToTop
            showAt = {10}
            easing = "easeInOutSine"
          >
            <i className = "fas fa-angle-up" />
          </BackToTop>
        </Route>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
serviceWorker.register();
