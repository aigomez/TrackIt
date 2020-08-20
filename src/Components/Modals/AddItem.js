import React from "react";
import ReactModal from 'react-modal';
import Ratings  from 'react-ratings-declarative';
import { NewFavUrl, CheckearVisto, CheckearVerDespues } from '../ApiUrls'
import Swal from 'sweetalert2'
import jwt from 'jwt-decode'

export default class AddItem extends React.Component {
  constructor() {
    super();
    this.state = {}
  }

  handleOpenModal_AddItem = () => {
    this.setState({ showModal_AddItem: true });
    document.body.style.overflow = "hidden";
  }

  handleCloseModal_AddItem = () => {
    this.setState({ showModal_AddItem: false, poster: '', titulo: '', fecha: '', tipo: '', clase: '', comentarios: '', rating: 0, isLoading: false });
    document.body.style.overflowY = "scroll";
  }

  onChangeRating = ( newRating ) => {
    this.setState({ rating: newRating });
  }

  async checkearVisto() {
    await fetch(`${CheckearVisto}` + this.idUser + '/' + this.props.titulo,
      { headers: { token: this.props.tokenSitio } })
      .then(res => res.json())
      .then(res => {
        if (res === true) {
          Swal.fire({
              icon: 'error', title: 'Este item ya está en tu lista de favoritos', showConfirmButton: false,
              timer: 3000, timerProgressBar: true, toast: true, position: 'bottom'
          })
        }
        else { this.handleOpenModal_AddItem() }
      })
      .catch((error) => console.log(error));
  }

  async checkearVerDespues() {
    await fetch(`${CheckearVerDespues}` + this.idUser + '/' + this.props.titulo,
      { headers: { token: this.props.tokenSitio } })
      .then(res => res.json())
      .then(res => {
        if (res === true) {
          Swal.fire({
              icon: 'error', title: 'Este item ya está en tu lista de favoritos', showConfirmButton: false,
              timer: 3000, timerProgressBar: true, toast: true, position: 'bottom'
          })
        }
        else { this.añadirItem() }
      })
      .catch((error) => console.log(error));
  }

  async verificarItem () {
    this.idUser = Object.values(jwt(this.props.tokenSitio))[0]

    if (this.props.opcionVisto === true) { this.checkearVisto() }
    else { this.checkearVerDespues() }
  }

  async añadirItem () {
    await fetch(`${NewFavUrl}` + this.idUser,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: this.props.tokenSitio },
      body: JSON.stringify({
        poster: this.props.poster, titulo: this.props.titulo, fecha: this.state.fecha, tipo: this.props.tipo,
        genero: this.props.genero, clase: this.props.clase, comentarios: this.state.comentarios, rating: this.state.rating,
        vistoAñadido: this.props.vistoAñadido, verDespuesAñadido: this.props.verDespuesAñadido, isLoading: true
      })
    })
      .then(res => res.json())
      .then(json => {
        Swal.fire({
            icon: 'success', title: 'Se añadió este item a tu lista de favoritos', showConfirmButton: false,
            timer: 3000, timerProgressBar: true, toast: true, position: 'bottom'
        })

        this.setState({ isLoading: false });
        this.handleCloseModal_AddItem();
        this.props.operacionExitosa(true)
      })
  }

  render() {
    return (
      <ReactModal
        isOpen = { this.state.showModal_AddItem }
        contentLabel = "Add Item"
        ariaHideApp = {false}
        className = "Modal"
        overlayClassName = "Overlay"
        onRequestClose = { this.handleCloseModal_AddItem }
      >
        <div className = "center">
          <button className = "btn-Close" onClick = { this.handleCloseModal_AddItem }>×</button>

          <br />

          <label className = "new-icon fas fa-calendar-alt black-icon" />
          <input
            type = "date"
            placeholder = "Fecha"
            value = {this.state.fecha}
            onChange = {(event) => this.setState({ fecha: event.target.value })}
            className = "input"
          />

          <br />

          <label className = "icon-bookmark new-icon fas fa-bookmark" />
          <textarea
            placeholder = "Comentarios"
            value = {this.state.comentarios}
            onChange = {(event) => this.setState({ comentarios: event.target.value })}
            className = "input input-descripcion"
          />

          <br />

          <Ratings
            rating = { this.state.rating }
            widgetRatedColors = "#f03465"
            changeRating = { this.onChangeRating }
          >
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
            <Ratings.Widget widgetDimension="30px" widgetHoverColor = "#ff9900" />
          </Ratings>

          <br />

          <button className = "btn-Submit" onClick = {() => this.añadirItem() }> Añadir a vistos </button>
        </div>
      </ReactModal>
    )
  }
}
