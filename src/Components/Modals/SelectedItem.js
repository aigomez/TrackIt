import React from "react";
import ReactModal from 'react-modal';
import { SelecItemsUrl } from '../ApiUrls'
import { Spinner } from 'react-activity';

export default class SelectedItem extends React.Component {
  constructor() {
    super();
    this.state = { isLoading: true, dataSource_Selected: [] };
  }

  handleOpenModal_Item = () => {
    this.setState({ showModal_Item: true });
    document.body.style.overflow = "hidden";
  }

  handleCloseModal_Item = () => {
    this.setState({ showModal_Item: false, isLoading: true });
    document.body.style.overflowY = "scroll";
  }

  async findById () {
    await fetch(`${SelecItemsUrl}` + this.props.imdbID )
      .then(res => res.json())
      .then(res => this.setState({ dataSource_Selected: res, isLoading: false }))
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <ReactModal
        isOpen = { this.state.showModal_Item }
        contentLabel = "Selected Item"
        ariaHideApp = {false}
        className = "selected-Modal"
        overlayClassName = "Overlay"
        onRequestClose = {this.handleCloseModal_Item}
      >
        {
          this.state.isLoading === true?
            <div className = "center-spinner">
              <Spinner color = 'white' size = {23}/>
            </div>
          :
            <div>
            {
             this.state.dataSource_Selected.map(item =>
              <div className = "center" key = {item.imdbID}>
                <img className = "selected-imagen" src = {item.Poster} alt = ""/>

                <div className = "selected-cont">
                   <p className = "selected-nombre"><label className = "icon fas fa-tag black-icon" /> { item.Title }</p>
                   <p className = "selected-tipo"><label className = "icon fas fa-dice-d6" /> { item.Type }</p>
                   <p className = "selected-genero"><label className = "icon fas fa-chart-pie" /> { item.Genre }</p>
                   <p className = "selected-fecha"><label className = "icon fas fa-calendar-alt black-icon" /> { item.Year }</p>
                   <p className = "selected-descripcion"><label className = "icon fas fa-bookmark" /> { item.Plot }</p>
               </div>
            </div>
            )
          }
          </div>
        }
      </ReactModal>
    );
  }
}
