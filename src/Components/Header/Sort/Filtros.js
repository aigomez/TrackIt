import React from "react";
import { Dropdown } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import { GenerosUrl } from '../../ApiUrls'
import { withRouter } from "react-router-dom";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class Filtros extends React.Component {
  constructor() {
    super();
    this.state = {
      generosAmbas: [],
      generosPeliculas: [],
      generosSeries: [],
      open: false,
      orden: "Nombre A - Z",
      opcionesBiblio: Biblioteca,
      opcionesFav: Favoritos
    };
  }

  componentDidMount() {
    fetch(`${GenerosUrl}`)
      .then(res => res.json())
      .then(res => this.setState({ dataSource: res }))
      .catch((error) => console.log(error));

      document.getElementById("menu").addEventListener('click', () => this.dropdownMenu());
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      await this.limpiarFiltros()
    }
  }

  async limpiarFiltros() {
    await this.setState({ value: 'Nombre A - Z', orden: 'Nombre A - Z', tipo: '', generosAmbas: [], generosPeliculas: [], generosSeries: [] })
    this.props.filtro(this.state.orden + '/sinElegir/sinElegir')
  }

  limpiarFiltrosDropDown = async (e, {value} ) => {
    await this.limpiarFiltros()
  }

  Generos = async (e, {value} ) => {
    switch (this.state.tipo) {
      case 'Peliculas Y Series':
        await this.setState({ generosAmbas: [value] })
        this.Filtros()
      break;

      case 'Peliculas':
        await this.setState({ generosPeliculas: [value] })
        this.Filtros()
      break;

      case 'Series':
        await this.setState({ generosSeries: [value] })
        this.Filtros()
      break;
    }
  }

  Orden = async (e, {value} ) => {
    await this.setState({ orden: value })
    this.Filtros()
  }

  async Filtros() {
    switch (this.state.tipo) {
      case 'Peliculas Y Series':
        this.props.filtro(this.state.orden + '/sinElegir/' + this.state.generosAmbas.toString().replace(/,/gi, ', ') )
        await this.setState({ value: 'Peliculas Y Series / ' + this.state.generosAmbas.toString().replace(/,/gi, ', ') })
      break;

      case 'Peliculas':
        this.props.filtro(this.state.orden + '/Pelicula/' + this.state.generosPeliculas.toString().replace(/,/gi, ', ') )
        await this.setState({ value: 'Peliculas / ' + this.state.generosPeliculas.toString().replace(/,/gi, ', ')  })
      break;

      case 'Series':
        this.props.filtro(this.state.orden + '/Serie/' + this.state.generosSeries.toString().replace(/,/gi, ', ') )
        await this.setState({ value: 'Series / ' + this.state.generosSeries.toString().replace(/,/gi, ', ')  })
      break;

      default:
        this.props.filtro(this.state.orden + '/sinElegir/sinElegir')
        await this.setState({ value: this.state.orden })
    }
  }

  // Solución al BUG de la Libreria: Cuando se hace click dentro del menú del dropdown el mismo se cerraba.
  dropdownMenu() {
    // impide que se cierre si se hizo click en el Menu (lo de adentro)
    this.setState({ dropdownMenu: true })
  }

  dropdownOpenClose(){
    if (this.state.dropdownMenu === true) {
      this.setState({ open: true, dropdownMenu: false })
    }

    else {
      // Si no se tocó el Menú, simplemente abre el dropdown o lo cierra
      this.setState({ open: !this.state.open })
    }
  }

  render() {
    return (
      <div className = "filtros in-line" title = {this.state.value || 'Nombre A - Z'}>
        <i className = "fas fa-filter filtros-i"/>
        <ClickAwayListener onClickAway = {() => this.setState({ open: false })}>
          <Dropdown
            className = "filtros-select"
            upward = {false}
            open = {this.state.open}
            onClick = {() => this.dropdownOpenClose()}
            text = {this.state.value || 'Filtros'}
            clearable = {true}
            value = {this.state.value || 'Nombre A - Z'}
            onChange = {this.limpiarFiltrosDropDown}
          >
            <Dropdown.Menu id = "menu">
              <Dropdown.Header>Tipos</Dropdown.Header>
              <Dropdown.Item id = "PeliculasySeries">
                <Dropdown
                  text = "Peliculas Y Series"
                  header = "Generos"
                  options = {this.state.dataSource}
                  onChange = {this.Generos}
                  onClick = {() => this.setState({ tipo: 'Peliculas Y Series' })}
                  scrolling = {true}
                  multiple = {true}
                  pointing = "left"
                  upward = {false}
                  selectOnBlur = {false}
                  selectOnNavigation = {false}
                  value = {this.state.generosAmbas}
                />
              </Dropdown.Item>

              <Dropdown.Item id = "Peliculas">
                <Dropdown
                  text = "Peliculas"
                  header = "Generos"
                  options = {this.state.dataSource}
                  onChange = {this.Generos}
                  onClick = {() => this.setState({ tipo: 'Peliculas' })}
                  scrolling = {true}
                  multiple = {true}
                  pointing = "left"
                  upward = {false}
                  selectOnBlur = {false}
                  selectOnNavigation = {false}
                  value = {this.state.generosPeliculas}
                />
              </Dropdown.Item>

              <Dropdown.Item id = "Series">
                <Dropdown
                  text = "Series"
                  header = "Generos"
                  options = {this.state.dataSource}
                  onChange = {this.Generos}
                  onClick = {() => this.setState({ tipo: 'Series' })}
                  scrolling = {true}
                  multiple = {true}
                  pointing = "left"
                  upward = {false}
                  selectOnBlur = {false}
                  selectOnNavigation = {false}
                  value = {this.state.generosSeries}
                />
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Header>Orden</Dropdown.Header>
              {
                this.props.location.pathname === '/'?
                <span className = "sub-items">
                  {this.state.opcionesBiblio.map(opcion => (
                    <Dropdown.Item {...opcion} onClick = {this.Orden} active = {opcion.value === this.state.orden} />
                  ))}
                </span>
                :
                <span className = "sub-items">
                  {this.state.opcionesFav.map(opcion => (
                    <Dropdown.Item {...opcion} onClick = {this.Orden} active = {opcion.value === this.state.orden} />
                  ))}
                </span>
              }
            </Dropdown.Menu>
          </Dropdown>
        </ClickAwayListener>
      </div>
    )
  }
}

export default withRouter(Filtros)

const Biblioteca = [
  { text: 'Nombre A - Z', key: "Nombre A - Z", value: "Nombre A - Z" },
  { text: 'Nombre Z - A', key: "Nombre Z - A", value: "Nombre Z - A"  },
  { text: 'Emitidos Recientemente', key: "Emitidos Recientemente", value: "Emitidos Recientemente"  },
  { text: 'Más Antiguos', key: "Más Antiguos", value: "Más Antiguos"  }
]

const Favoritos = [
  { text: 'Nombre A - Z', key: "Nombre A - Z", value: "Nombre A - Z" },
  { text: 'Nombre Z - A', key: "Nombre Z - A", value: "Nombre Z - A" },
  { text: 'Mejores Puntuados', key: "Mejores Puntuados", value: "Mejores Puntuados" },
  { text: 'Peores Puntuados', key: "Peores Puntuados", value: "Peores Puntuados" },
  { text: 'Añadidos Recientemente', key: "Añadidos Recientemente", value: "Añadidos Recientemente" },
  { text: 'Vistos', key: "Vistos", value: "Vistos" },
  { text: 'Veré Después', key: "Veré Después", value: "Veré Después" }
]
