import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter: state.counter
})
export class DocumentView extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render () {
    return (
      <div>
        <h2>Document</h2>
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(DocumentView)
