import React from "react";
import ReactModal from 'react-modal';
import { JoinUrl } from '../ApiUrls'
import { Spinner } from 'react-activity';
import Swal from 'sweetalert2'

export default class Join extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      type: 'password',
    }
  }

  handleOpenModal_Join = () => {
    this.setState({ showModal_Join: true });
    document.body.style.overflow = "hidden";
  }

  handleCloseModal_Join = () => {
    this.setState({ showModal_Join: false });
    document.body.style.overflowY = "scroll";
  }

  async onSubmit (event) {
    if (this.state.password.length < 8) {
      Swal.fire({
          icon: 'error', title: 'La contraseña debe contener al menos 8 caracteres', showConfirmButton: false,
          timer: 3500, timerProgressBar: true, toast: true, position: 'bottom'
      })
    }

    else {
      await this.setState({ isLoading: true })
      await fetch(`${JoinUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email, password: this.state.password })
      })

      .then(res => res.json())
      .then(json => {
        if (json.id > 0) {
          Swal.fire({
              icon: 'success', title: 'Usuario creado satisfactoriamente, ya puede ingresar al sistema', showConfirmButton: false,
              timer: 3300, timerProgressBar: true, toast: true, position: 'bottom'
          })
          this.setState({ email: "", password: "", passwordConfirm: "", direccion: "",  nombre: "", apellido: "", isLoading: false });
          this.handleCloseModal_Join();
        }
        else {
          Swal.fire({
            icon: 'error', title: 'Tu email no tiene un formato válido o ya se encuentra en uso', showConfirmButton: false,
            timer: 3000, timerProgressBar: true, toast: true, position: 'bottom'
          })
          this.setState({ isLoading: false });
        }
      })
    }
  }

  async onlyLetters(event) {
    const re = /[a-zA-Z_ ]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  async onlyLettersNumbers(event) {
    const re = /[0-9a-zA-Z_ ]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  showHide(e) { this.setState({ type: this.state.type === 'input' ? 'password' : 'input' }) }

  render() {
    return (
      <div>
        <button className = "btn-join" onClick = { this.handleOpenModal_Join }>
          <span className = "fas fa-user"/>
          <span> Unirse </span>
        </button>

        <ReactModal
          isOpen = { this.state.showModal_Join }
          contentLabel = "Join"
          ariaHideApp = {false}
          className = "mtop Modal"
          overlayClassName = "Overlay"
          onRequestClose = { this.handleCloseModal_Join }
        >

          <div className = "center">
            <button className = "btn-Close" onClick = { this.handleCloseModal_Join }>×</button>
            
            <h1>Unirse</h1>
            <label className = "icon-top new-icon fas fa-envelope" />
            <input
              placeholder = "Email"
              value = {this.state.email}
              onChange = {(event) => this.setState({ email: event.target.value })}
              className = "input"
              type = "email"
            />

            <br />

            <div className = "inside-input">
              <label className = "new-icon fas fa-key" />
              <input
                type = {this.state.type}
                placeholder = "Contraseña"
                value = {this.state.password}
                onChange = {(event) => this.setState({ password: event.target.value })}
                className = "input"
              />

              <span onClick = {() => this.showHide()}>
                {this.state.type === 'password' ?
                <i className = "fas fa-eye" /> : <i className = "new-icon fas fa-eye-slash" />}
              </span>
            </div>

            <br />

            {
              this.state.isLoading === true?
              <button className = "btn-Submit"><Spinner color = 'white'/></button>
              :
              <button className = "btn-Submit" onClick = {(event) => this.onSubmit(event) }> Unirse </button>
            }
          </div>
        </ReactModal>
      </div>
    );
  }
}
