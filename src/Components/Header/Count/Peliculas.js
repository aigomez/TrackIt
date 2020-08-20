import React from "react";
import { PeliculasUrl } from '../../ApiUrls'
import jwt from 'jwt-decode'

export default class Peliculas extends React.Component {
  constructor() {
    super();
    this.state = { dataSource_Count: [] };
  }

  componentDidMount() {
    if (this.props.tokenSitio !== '') {
      this.idUser = Object.values(jwt(this.props.tokenSitio))[0]

      fetch(`${PeliculasUrl}` + this.idUser, { headers: { token: this.props.tokenSitio } })
        .then(res => res.json())
        .then(res => this.setState({ dataSource_Count: res, Peliculas: res.Peliculas }))
        .catch((error) => console.log(error));
    }

    else {
      this.setState({ Peliculas: 0 })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.tokenSitio !== prevProps.tokenSitio) {
      this.componentDidMount()
    }
  }

  sumPeliculas() { this.setState({ Peliculas: this.state.Peliculas + 1 }) }
  delPeliculas() { this.setState({ Peliculas: this.state.Peliculas - 1 }) }

  render() {
    return (
      <span><label className = "fas fa-video" /> Peliculas: {this.state.Peliculas} </span>
    )
  }
}
