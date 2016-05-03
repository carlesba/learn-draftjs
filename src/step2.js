import React, {Component} from 'react'
import {
  Editor,
  EditorState,
  CompositeDecorator,
  Entity,
  AtomicBlockUtils
} from 'draft-js'

//
// Step 2: ENTITIES: with Atomic Blocks
//

export default class MyEditor extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.addImageEntity = this.addImageEntity.bind(this)
    this.state = {
      editorState: EditorState.createEmpty(
        this.createDecorators()
      )
    }
  }
  render () {
    return (
      <div className='o-fill c-my-editor'>
        <div className='c-editor-controls'>
          <button onClick={this.addImageEntity}>Add Entity</button>
        </div>
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
      },
      {
        strategy: findImageEntity,
        component: ImageEntity
      }
    ])
  }
  addImageEntity () {
    const entityKey = Entity.create('IMAGE', 'MUTABLE', {url: 'http://nicolasemple.com/wp-content/uploads/2013/12/well-done.jpg'})
    const newState = AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      ' '
    )
    this.onChange(newState)
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
  return (
    <div
      className='c-mention'
      onClick={() => foo()}
    >
      {children}
    </div>
  )
}

// **************************************
//
// New stuff
//
// *************************************

function findImageEntity (block, callback) {
  block.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return entityKey !== null && Entity.get(entityKey).getType() === 'IMAGE'
    },
    callback
  )
}

const ImageEntity = ({children, entityKey}) => {
  const {url} = Entity.get(entityKey).getData()
  return (
    <div className='c-gif'>
      <img src={url} />
      {children}
    </div>
  )
}
