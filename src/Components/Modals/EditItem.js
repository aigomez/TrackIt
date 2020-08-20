import React from "react";
import ReactModal from 'react-modal';
import Ratings  from 'react-ratings-declarative';
import { Dropdown } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import { EditFavUrl } from '../ApiUrls'

export default class EditItem extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleOpenModal_Edit = () => {
    this.setState({ showModal_Edit: true, fecha: this.props.fecha, clase: this.props.clase, comentarios: this.props.comentarios, rating: this.props.rating });
    document.body.style.overflow = "hidden";

    if (this.state.clase === 'Visto') { this.setState({ rBtnVisto: true}) }
    else { this.setState({ rBtnVereDespues: true}) }
  }

  handleCloseModal_Edit = () => {
    this.setState({ showModal_Edit: false, rBtnVisto: false, rBtnVereDespues: false });
    document.body.style.overflowY = "scroll";
  }

  onChangeRating = ( newRating ) => {
    this.setState({ rating: newRating });
  }

  async onChangeClase(event) {
    await this.setState({ clase: event.target.value})

    if (this.state.clase === 'Visto') {
      await this.setState({ rBtnVereDespues: false, rBtnVisto: true })
    }

    else {
      await this.setState({ rBtnVisto: false, rBtnVereDespues: true })
    }
  }

  async resetRating() { await this.setState({ rating: 0 }); }

  async onEdit () {
    await fetch(`${EditFavUrl}` + this.props.idUser + '/' + this.props.idItem ,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: this.props.tokenSitio },
      body: JSON.stringify({ fecha: this.state.fecha, comentarios: this.state.comentarios, clase: this.state.clase, rating: this.state.rating })
    })
    this.props.action('edit')
    this.handleCloseModal_Edit();
  }

  render() {
    return (
      <ReactModal
        isOpen = { this.state.showModal_Edit }
        contentLabel = "Edit Item"
        ariaHideApp = {false}
        className = "Modal"
        overlayClassName = "Overlay"
        onRequestClose = {this.handleCloseModal_Edit}
      >
        <div className = "center" key = {this.props._id}>
          <button className = "btn-Close" onClick = { this.handleCloseModal_Edit }>×</button>

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

          <div onChange = {(event) => this.onChangeClase(event)}>
            <label className = "rButton">
              <input type="radio" value = 'Visto' checked = {this.state.rBtnVisto} /> Visto
            </label>

            <label className = "rButton">
              <input className = "m-left" type = "radio" value = 'Veré Después' checked = {this.state.rBtnVereDespues} /> Veré Después
            </label>
          </div>

          <br />

          <i className = "fas fa-bomb reset-icon" onClick = {() => this.resetRating()}/>
          <Ratings
            rating = {this.state.rating}
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

          <button className = "btn-Submit" onClick = {() => this.onEdit(this.props._id) }> Editar </button>
        </div>
      </ReactModal>
    );
  }
}
