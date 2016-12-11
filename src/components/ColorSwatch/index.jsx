import React, { PropTypes } from 'react'

import './styles.css'

import colors from './colors.json'

export default class ColorSwatch extends React.Component {
  static propTypes = {
    colors: PropTypes.array,
    selected: PropTypes.number,
    value: PropTypes.string,
    onColorChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    colors: colors,
    value: colors[0]
  };

  constructor (props) {
    super(props)
    const {colors, value} = props
    let selected = 0
    for (const c in colors) {
      if (colors[c].toUpperCase() === value.toUpperCase()) {
        selected = parseInt(c, 10)
        break
      }
    }

    this.state = {
      selected: selected
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
    const className = i === this.state.selected ? 'selected' : null
    return (
      <button
        key={'clr-swatch-' + i}
        className={className}
        style={{ backgroundColor: color }}
        onClick={this.handleClick(i)}
      />
    )
  }

  render () {
    return (
      <div className='ColorSwatch'>
        {this.props.colors.map(this.buildSwatch, this)}
      </div>
    )
  }
}

