import React from "react";
import { Digital } from 'react-activity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyImage } from "react-lazy-images";
import jwt from 'jwt-decode'

import { FiltrosFavUrl, BusqFilFavUrl } from '../ApiUrls'
import SelectedItem from '../Modals/SelectedItemFav'
import EditItem from '../Modals/EditItem'
import DeleteItem from '../CRUD/DeleteItem'

export default class Favoritos extends React.Component {
  constructor() {
    super();
    this.selectedItem = React.createRef();
    this.deleteItem = React.createRef();
    this.editItem = React.createRef();

    this.state = {
      dataSource: [],
      isLoading: true,
      hasMore: true,
      action: '',
      limit: 6,
    };
  }

  async componentDidMount() {
    if (this.props.tokenSitio !== '') {
      this.idUser = Object.values(jwt(this.props.tokenSitio))[0]

      await fetch(`${FiltrosFavUrl}` + this.idUser + '/' + this.props.filtro + '/' + this.state.limit,
        { headers: { token: this.props.tokenSitio } })
        .then(res => res.json())
        .then(res => this.setState({ dataSource: res, isLoading: false, filtrar: 'Filtro' }))
        .catch((error) => console.log(error));
    }

    else {
      this.setState({ dataSource: 'Usuario no loggeado', isLoading: false })
    }
  }

  async busquedaFiltro() {
    if (this.props.tokenSitio !== '') {
      this.idUser = Object.values(jwt(this.props.tokenSitio))[0]

      await fetch(`${BusqFilFavUrl}` + this.idUser + '/' + this.props.busqueda + '/' + this.props.filtro + '/' + this.state.limit,
        { headers: { token: this.props.tokenSitio } })
        .then(res => res.json())
        .then(res => this.setState({ dataSource: res, isLoading: false, filtrar: 'Busqueda + Filtro' }))
        .catch((error) => console.log(error));
    }

    else {
      this.setState({ dataSource: 'Usuario no loggeado', isLoading: false })
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.tokenSitio !== prevProps.tokenSitio) {
      await this.componentDidMount()
    }

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

    if (this.state.action !== '') {
      await this.componentDidMount()
      await this.setState({action: ''})
    }

    await this.afterDelete()
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

  async onDelete (_id, clase, tipo) {
    await this.setState({ _id: _id, clase: clase, tipo: tipo });
    this.deleteItem.current.onDelete();
  }

  afterDelete() {
    if (this.state.action === 'delete' && this.state.clase === 'Visto') {
      this.props.delCount(this.state.tipo)
    }

    if (this.state.action === 'delete' && this.state.clase === 'Ver Después') {
      this.props.delCount('Ver Despues')
    }
  }

  async findById (_id) {
    await this.setState({ _id: _id });
    this.selectedItem.current.findById();
    this.selectedItem.current.handleOpenModal_Item()
  }

  async handleOpenModal_Edit (_id, fecha, comentarios, clase, rating) {
    await this.setState({ _id: _id, fecha: fecha, comentarios: comentarios, clase: clase, rating: rating })
    this.editItem.current.handleOpenModal_Edit()
  }

  async action(newAction) { await this.setState({ action: newAction }) }

  render() {
    if (this.state.isLoading === true) {
      return (
        <div className = "center-digital">
          <Digital />
        </div>
      )
    }

    if (this.state.dataSource === 'Usuario no loggeado') {
      return (
        <div className = "fav-sinDatos center">
          <i className = "fas fa-exclamation-triangle"></i>
          <p>Para ver tus peliculas y series favoritas es necesario que ingreses con tus datos</p>
        </div>
      )
    }

    if (this.state.dataSource.length === 0) {
      return (
        <div className = "fav-sinDatos center">
          <i className = "fas fa-exclamation-triangle"></i>
          <p>No se encontró ninguna serie o película añadida</p>
        </div>
      )
    }

    else {
      return (
        <div>
          <InfiniteScroll
            dataLength = { this.state.dataSource.length }
            next = { () => this.loadOnScroll() }
            hasMore = { this.state.hasMore }
            loader = { <div className = "center-digital-scroll"><Digital /></div> }
          >
            <div className = "items">
            {
              this.state.dataSource.map(item =>
              <div key = {item._id}>
                <LazyImage
                  className = "thumbnail"
                  src = {item.poster}
                  placeholder={({ imageProps, ref }) => ( <img className = "thumbnail" src = 'https://dl3.pushbulletusercontent.com/8MgKBLzIPiimAOymmd80yKqOlGXaVoCb/ezgif-2-5b1003040ca6.gif' ref = {ref} alt = ""/> )}
                  actual={({ imageProps }) => <img {...imageProps} alt = ""/>}
                  onClick={() => { this.findById(item._id) }}
                />

                <div className = "div-initial">
                  <p title = { item.Title }><label className = "fas fa-tag" /> { item.titulo }</p>
                  <p><label className = "fas fa-calendar-alt" /> { item.fecha || 'N/A'}</p>
                  <p><label className = "fas fa-star" /> { item.rating || 'N/A'}</p>
                  <p><label className = "fas fa-star" /> { item.clase }</p>

                  <button className = "edit" onClick={() => { this.handleOpenModal_Edit(item._id, item.fecha, item.comentarios, item.clase, item.rating)} }>
                    <label className = "fas fa-pencil-alt"/>
                  </button>

                  <button className = "delete" onClick={() => { this.onDelete(item._id, item.clase, item.tipo)}}>
                    <label className = "fas fa-trash-alt"/>
                  </button>
                </div>
              </div>
              )
            }
            </div>
          </InfiniteScroll>

          <SelectedItem tokenSitio = {this.props.tokenSitio} idUser = {this.idUser} idItem = {this.state._id} ref = {this.selectedItem} />
          <DeleteItem
            tokenSitio = {this.props.tokenSitio} idUser = {this.idUser} idItem = {this.state._id}
            ref = {this.deleteItem} action = {(newAction) => this.action(newAction)}
          />
          <EditItem
            tokenSitio = {this.props.tokenSitio} idUser = {this.idUser} idItem = {this.state._id}
            ref = {this.editItem} action = {(newAction) => this.action(newAction)}
            clase = {this.state.clase} fecha = {this.state.fecha} comentarios = {this.state.comentarios} rating = {this.state.rating}
          />
        </div>
      )
    }
  }
}
