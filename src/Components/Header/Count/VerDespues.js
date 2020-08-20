import React from "react";
import { VerDespuesUrl } from '../../ApiUrls'
import jwt from 'jwt-decode'

export default class VerDespues extends React.Component {
  constructor() {
    super();
    this.state = { dataSource_Count: [] };
  }

  componentDidMount() {
    if (this.props.tokenSitio !== '') {
      this.idUser = Object.values(jwt(this.props.tokenSitio))[0]

      fetch(`${VerDespuesUrl}` + this.idUser, { headers: { token: this.props.tokenSitio } })
        .then(res => res.json())
        .then(res => this.setState({ dataSource_Count: res, VerDespues: res.VerDespues }))
        .catch((error) => console.log(error));
    }

    else {
      this.setState({ VerDespues: 0 })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.tokenSitio !== prevProps.tokenSitio) {
      this.componentDidMount()
    }
  }

  sumVerDesps() { this.setState({ VerDespues: this.state.VerDespues + 1 }) }
  delVerDesps() { this.setState({ VerDespues: this.state.VerDespues - 1 }) }

  render() {
    return (
      <span>
        <label className = "fas fa-clock" /> Veré Después: {this.state.VerDespues}
      </span>
    )
  }
}
