import React, {Component} from 'react'
import {
  Editor,
  EditorState,
  CompositeDecorator
} from 'draft-js'

//
// Step 1: DECORATORS
//

export default class MyEditor extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      editorState: EditorState.createEmpty(
        this.createDecorators()
      )
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
    this.setState({ editorState })
  }
  createDecorators () {
    return new CompositeDecorator([
      {
        strategy: mentionStrategy,
        component: Mention,
        props: {
          foo: () => {
            console.log('callback executed!!!')
          }
        }
      }
    ])
  }
}

const HASHTAG_REGEX = /@[\w\u0590-\u05ff]+/g

const mentionStrategy = (block, callback) => {
  return findWithRegex(HASHTAG_REGEX, block, callback)
}

function findWithRegex (regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const Mention = ({children, foo}) => {
  console.log('Mention rendered')
  return (
    <div
      className='c-mention'
      onClick={() => foo()}
    >
      {children}
    </div>
  )
}
