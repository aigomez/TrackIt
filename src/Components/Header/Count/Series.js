import React from "react";
import { SeriesUrl } from '../../ApiUrls'
import jwt from 'jwt-decode'

export default class Series extends React.Component {
  constructor() {
    super();
    this.state = { dataSource_Count: [] };
  }

  componentDidMount() {
    if (this.props.tokenSitio !== '') {
      this.idUser = Object.values(jwt(this.props.tokenSitio))[0]

      fetch(`${SeriesUrl}` + this.idUser, { headers: { token: this.props.tokenSitio } })
        .then(res => res.json())
        .then(res => this.setState({ dataSource_Count: res, Series: res.Series }))
        .catch((error) => console.log(error));
    }

    else {
      this.setState({ Series: 0 })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.tokenSitio !== prevProps.tokenSitio) {
      this.componentDidMount()
    }
  }

  sumSeries() { this.setState({ Series: this.state.Series + 1 }) }
  delSeries() { this.setState({ Series: this.state.Series - 1 }) }

  render() {
    return (
      <span>
        <label className = "fas fa-couch" /> Series: {this.state.Series}
      </span>
    )
  }
}
