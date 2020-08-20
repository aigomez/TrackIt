import React from "react";

export default class Busqueda extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async Busqueda (event) {
    await this.setState({ busqueda: event.target.value })

    if (this.state.busqueda !== '') {
      this.props.busqueda(this.state.busqueda)
    }

    if (this.state.busqueda.trim() === '') {
      this.props.busqueda('')
    }
  }

  render() {
    return (
      <div className = "search">
        <input
          placeholder = "Buscá una película o serie"
          className = "searchTerm"
          onChange = {(event) => this.Busqueda(event)}
        />

        <button type="submit" className = "searchButton">
         <i className = "fas fa-search" />
        </button>
      </div>
    )
  }
}
