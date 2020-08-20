import React from "react";
import Swal from 'sweetalert2'
import { DeleteFavUrl } from '../ApiUrls'

export default class DeleteItem extends React.Component {

  onDelete () {
    Swal.fire({
      icon: 'warning', title: 'Estas seguro?', confirmButtonText: 'Si', cancelButtonText: 'No', showCancelButton: true,
      confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', toast: true, position: 'bottom'
    })

      .then((result) => {
        if (result.value) {
          fetch(`${DeleteFavUrl}` + this.props.idUser + '/' + this.props.idItem,{
            method: 'DELETE',
            headers: { token: this.props.tokenSitio }
          })
          this.props.action('delete')

          Swal.fire({
              icon: 'success', title: 'Se eliminó este item de tu lista de favoritos', showConfirmButton: false,
              timer: 2000, timerProgressBar: true, toast: true, position: 'bottom'
          })
        }
    })
  }

  render () { return null; }
}
