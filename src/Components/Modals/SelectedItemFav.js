import React from "react";
import ReactModal from 'react-modal';
import { FavItemUrl } from '../ApiUrls'
import { Spinner } from 'react-activity';
import Ratings  from 'react-ratings-declarative';

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
    await fetch(`${FavItemUrl}` + this.props.idUser + '/' + this.props.idItem,
      { headers: { token: this.props.tokenSitio } })
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
                <div className = "center" key = {item._id}>
                  <img className = "selected-imagen" src = {item.poster} alt = "" />

                  <div className = "selected-cont">
                   <p className = "selected-nombre"><label className = "icon fas fa-tag black-icon" /> { item.titulo }</p>
                   <p className = "selected-tipo"><label className = "icon fas fa-dice-d6" /> { item.tipo }</p>
                   <p className = "selected-genero"><label className = "icon fas fa-dice-d6" /> { item.genero }</p>
                   <p className = "selected-clase"><label className = "icon fas fa-chart-pie" /> { item.clase }</p>
                   <p className = "selected-fecha"><label className = "icon fas fa-calendar-alt black-icon" /> { item.fecha }</p>
                   <p className = "selected-descripcion"><label className = "icon fas fa-bookmark" /> { item.comentarios }</p>

                   <Ratings
                     rating = { item.rating }
                     widgetRatedColors = "#f03465"
                   >
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                     <Ratings.Widget widgetDimension="30px" />
                   </Ratings>
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
