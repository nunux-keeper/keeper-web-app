import React, { PropTypes } from 'react'

import styles from './styles.scss'

import colors from './colors.json'

export default class ColorSwatch extends React.Component {
  static propTypes = {
    colors: PropTypes.array,
    selected: PropTypes.number,
    onColorChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    colors: colors,
    selected: 0
  };

  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected
    }
  }

  handleClick (index) {
    return (e) => {
      e.preventDefault()
      this.setState({selected: index})
      this.props.onColorChange(this.props.colors[index])
    }
  }

  buildSwatch (color, i) {
    const className = i === this.state.selected ? styles.selected : null
    return (
      <button
        key={ 'clr-swatch-' + i }
        className={className}
        style={{ backgroundColor: color }}
        onClick={this.handleClick(i)}
      />
    )
  }

  render () {
    return (
      <div className={ styles.swatch }>
        {this.props.colors.map(this.buildSwatch, this)}
      </div>
    )
  }
}

