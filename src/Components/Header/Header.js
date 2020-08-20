import React from "react";
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className = "in-line btns-header">
        <Link to = '/'>
          <i className = "fas fa-book" />
        </Link>

        <Link to = '/favoritos'>
        < i className = "fas fa-heart" />
        </Link>
      </div>
    );
  }
}
