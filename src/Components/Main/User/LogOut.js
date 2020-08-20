import React from "react";
import cookie from 'react-cookies'
import Swal from 'sweetalert2'

export default class Data extends React.Component {
  constructor() {
    super();
    this.state = {}
  }

  onLogout() {
    cookie.remove('tokenSitio', { path: '/' })
    this.props.isLogged('')

    Swal.fire({
      icon: 'success', title: 'Te deslogeaste satisfactoriamente', showConfirmButton: false,
      timer: 2000, timerProgressBar: true, toast: true, position: 'bottom'
    })
  }

  render() {
    return (
       <div>
         <button className = "btn-logout" onClick = {() => this.onLogout()}>
           <span className = "fas fa-sign-out-alt"/>
           <span> Salir </span>
         </button>
       </div>
   );
 }
}
