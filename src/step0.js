import React, {Component} from 'react'
import {
  Editor,
  EditorState,
  convertToRaw
} from 'draft-js'

//
// Step 0: BASICS
//

// Docs
// DraftJS:       https://facebook.github.io/draft-js/docs/overview.html
// ImmutableJS:   https://facebook.github.io/immutable-js/docs/
// How DraftJS represent data: https://medium.com/@rajaraodv/how-draft-js-represents-rich-text-data-eeabb5f25cf2

export default class MyEditor extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }
  render () {
    return (
      <div className='o-fill c-my-editor'>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    )
  }
  onChange (editorState) {
    // // Check how editorState changes
    // console.log('editorState changes:', editorState)
    //
    // // Internal Structure
    // // Editor State
    // //   - getCurrentContent(): ContentState
    // console.log('ContentState', editorState.getCurrentContent())
    // // ContentState
    // //   - getBlockMap()
    // console.log('BlockMap', editorState.getCurrentContent().getBlockMap())
    // console.log('BlockMap as plain Array', editorState.getCurrentContent().getBlocksAsArray())
    //
    // // Readable State
    // console.log('Readable editorState:', convertToRaw(editorState.getCurrentContent()))
    this.setState({ editorState })
  }
}
