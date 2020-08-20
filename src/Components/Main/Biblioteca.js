import React from "react";
import { Digital } from 'react-activity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyImage } from "react-lazy-images";
import Swal from 'sweetalert2'
import { FiltrosBiblioUrl, BusqFilBiblioUrl } from '../ApiUrls'

import AddItem from '../Modals/AddItem'
import SelectedItem from '../Modals/SelectedItem'

export default class Biblioteca extends React.Component {
  constructor() {
    super();
    this.selectedItem = React.createRef();
    this.addItem = React.createRef();

    this.state = {
      dataSource: [],
      isLoading: true,
      hasMore: true,
      limit: 6,
    };
  }

  async componentDidMount() {
    await fetch(`${FiltrosBiblioUrl}` + this.props.filtro + '/' + this.state.limit)
      .then(res => res.json())
      .then(res => this.setState({ dataSource: res, isLoading: false, filtrar: 'Filtro' }))
      .catch((error) => console.log(error));
  }

  async busquedaFiltro() {
    await fetch(`${BusqFilBiblioUrl}` + this.props.busqueda + '/' + this.props.filtro + '/' + this.state.limit)
      .then(res => res.json())
      .then(res => this.setState({ dataSource: res, isLoading: false, filtrar: 'Busqueda + Filtro' }))
      .catch((error) => console.log(error));
  }

  async componentDidUpdate(prevProps) {

    // Filtro
    if (this.props.filtro !== prevProps.filtro && this.props.busqueda === '') {
      await this.setState({ filtro: this.props.filtro, filtrar: 'Filtro' })
      await this.loadOnScroll()
    }

    // Busqueda + Filtro
    if ((this.props.filtro !== prevProps.filtro && this.props.busqueda !== '') || (this.props.busqueda !== prevProps.busqueda && this.props.busqueda !== '')) {
      await this.setState({ limit: 6, filtrar: 'Busqueda + Filtro' })
      await this.loadOnScroll()
    }

    // Borrado de la busqueda
    if (this.props.busqueda !== prevProps.busqueda && this.props.busqueda === '') {
      await this.setState({ limit: 6, filtrar: 'Filtro', hasMore: true })
      await this.loadOnScroll()
    }
  }

  async loadOnScroll() {
    await this.setState({ limit: this.state.limit + 6 });

    switch (this.state.filtrar) {
      case 'Filtro':
          await this.componentDidMount()
      break;

      case 'Busqueda + Filtro':
          await this.busquedaFiltro()
      break;
    }

    if (this.state.limit > this.state.dataSource.length) { this.setState({ hasMore: false }) }
  }

  async findById (imdbID) {
    await this.setState({ imdbID: imdbID });
    this.selectedItem.current.findById();
    this.selectedItem.current.handleOpenModal_Item();
  }

  alertNotLogged () {
    Swal.fire({
        icon: 'error', title: 'Para añadir este item es necesario que ingreses con tus datos', showConfirmButton: false,
        timer: 4000, timerProgressBar: true, toast: true, position: 'bottom'
    })
  }

  async addItemRef (Poster, Title, Type, Genre) {
    if (this.props.tokenSitio === '') { this.alertNotLogged() }

    else {
      await this.setState({ Poster: Poster, Title: Title, Type: Type, Genre: Genre, Clase: 'Visto', opcionVisto: true });
      this.addItem.current.verificarItem()
    }
  }

  async addItemLaterRef (Poster, Title, Type, Genre) {
    if (this.props.tokenSitio === '') { this.alertNotLogged() }

    else {
      await this.setState({ Poster: Poster, Title: Title, Type: Type, Genre: Genre, Clase: 'Veré Después', opcionVisto: false });
      this.addItem.current.verificarItem()
    }
  }

  operacionExitosa(operacionExitosa) {
    if (this.state.opcionVisto === true) { this.props.sumCount(this.state.Type) }
    else { this.props.sumCount('Ver Despues') }
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <div className = "center-digital">
          <Digital />
        </div>
      )
    }

    if (this.state.dataSource.length === 0) {
      return (
        <div className = "fav-sinDatos center">
          <i className = "fas fa-exclamation-triangle"></i>
          <p>No se encontró ninguna serie o película con el filtro que seleccionaste</p>
        </div>
      )

    } else {
      return (
        <div>
          <InfiniteScroll
            dataLength = { this.state.dataSource.length }
            next = { () => this.loadOnScroll() }
            hasMore = { this.state.hasMore }
            loader = {<div className = "center-digital-scroll"><Digital /></div>}
          >
            <div className = "items">
              {
                 this.state.dataSource.map(item =>
                   <div key = {item.imdbID}>
                      <LazyImage
                        className = "thumbnail"
                        src = {item.Poster}
                        placeholder={({ imageProps, ref }) => ( <img className = "thumbnail" src = 'https://dl3.pushbulletusercontent.com/8MgKBLzIPiimAOymmd80yKqOlGXaVoCb/ezgif-2-5b1003040ca6.gif' ref = {ref} alt = ""/> )}
                        actual={({ imageProps }) => <img {...imageProps} alt = ""/>}
                        onClick={() => { this.findById(item.imdbID) }}
                      />

                    <div className = "div-initial">
                      <p title = { item.Title }><label className = "fas fa-tag" /> { item.Title }</p>
                      <p><label className = "fas fa-calendar-alt" /> { item.Year }</p>
                    </div>

                    <button title = "Añadir a peliculas / series vistas" className = "visto" onClick={() => { this.addItemRef(item.Poster,item.Title,item.Type, item.Genre) }}>
                      <p ><i className = "fas fa-plus-circle btn-add"/> Visto</p>
                    </button>

                    <button title = "Añadir a peliculas / series que miraré después" className = "visto ver-despues" onClick={() => { this.addItemLaterRef(item.Poster,item.Title,item.Type, item.Genre) }}>
                      <p><i className = "fas fa-plus-circle btn-add"/> Veré Después</p>
                    </button>
                  </div>
                 )
              }
            </div>
          </InfiniteScroll>

          <SelectedItem imdbID = {this.state.imdbID} ref = {this.selectedItem} />
          <AddItem tokenSitio = {this.props.tokenSitio} ref = {this.addItem} token = {this.props.tokenSitio}
            poster = {this.state.Poster} titulo = {this.state.Title} tipo = {this.state.Type} genero = {this.state.Genre} clase = {this.state.Clase}
            opcionVisto = {this.state.opcionVisto} operacionExitosa = {(operacionExitosa) => this.operacionExitosa(operacionExitosa)}
          />
        </div>
      )
    }
  }
}
