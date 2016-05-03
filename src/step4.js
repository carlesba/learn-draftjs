import React, {Component} from 'react'
import {
  Editor,
  EditorState,
  CompositeDecorator,
  Entity,
  RichUtils,
  Modifier
} from 'draft-js'

//
// Step 4: …and beyond (Selection, Modifiers…)
//
// 1. check doSomething method
// 2. check handleReturn method

export default class MyEditor extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.addLink = this.addLink.bind(this)
    this.doSomething = this.doSomething.bind(this)
    this.handleReturn = this.handleReturn.bind(this)
    this.state = {
      editorState: EditorState.createEmpty(
        this.createDecorators()
      ),
      url: ''
    }
  }
  render () {
    this.logBlockTypes()
    return (
      <div className='o-fill c-my-editor'>
        <div className='c-editor-controls'>
          <input type='text' value={this.state.url} onChange={(e) =>
            this.setState({url: e.target.value})
          } />
          <button onClick={this.addLink}>Add Link</button>
          <button onClick={this.doSomething}>Do Something</button>
        </div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          handleReturn={this.handleReturn}
        />
      </div>
    )
  }
  doSomething (evt) {
    const {editorState} = this.state
    // Selection
    const selection = editorState.getSelection()
    console.log('selection: ', selection, selection.toJS())

    // Modifiers
    //
    // https://facebook.github.io/draft-js/docs/api-reference-modifier.html#content

    // Splitting current line
    // const newContentState = Modifier.splitBlock(
    //   editorState.getCurrentContent(),
    //   selection
    // )

    // Set Type on Current line
    // const newContentState = Modifier.setBlockType(
    //   editorState.getCurrentContent(),
    //   selection,
    //   'blockquote'
    //   // try these instead
    //   // 'header-one'
    // )

    // Apply new content to the state
    // this.setState({
    //   editorState: EditorState.push(editorState, newContentState)
    // })
  }
  logBlockTypes () {
    this.state.editorState.getCurrentContent()
      .getBlocksAsArray()
      .map((block, index) => {
        console.log(index, block.getType())
      })
  }
  handleReturn () {
    // avoid default behavior by returning true

    // return true

    // Set behavior for return

    // const {editorState} = this.state
    // if (RichUtils.getCurrentBlockType(editorState) === 'header-one') {
    //   const splittedContent = Modifier.splitBlock(
    //     editorState.getCurrentContent(),
    //     editorState.getSelection()
    //   )
    //   const splittedState = EditorState.push(
    //     editorState,
    //     splittedContent
    //   )
    //   const newState = RichUtils.toggleBlockType(
    //     splittedState,
    //     'header-one'
    //   )
    //   this.setState({editorState: newState})
    //   return true
    }
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
        strategy: findLinkEntity,
        component: LinkEntity
      }
    ])
  }
  addLink () {
    const entityKey = Entity.create(
      'LINK',
      'MUTABLE', // try SEGMENTED, IMMUTABLE
      {url: this.state.url}
    )
    const {editorState} = this.state
    const newState = RichUtils.toggleLink(
      editorState,
      editorState.getSelection(),
      entityKey
    )
    this.setState({
      editorState: newState,
      url: ''
    })
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

function findLinkEntity (block, callback) {
  block.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return entityKey !== null && Entity.get(entityKey).getType() === 'LINK'
    },
    callback
  )
}

const LinkEntity = ({children, entityKey}) => {
  const {url} = Entity.get(entityKey).getData()
  return (
    <div className='c-gif'>
      <a href={url}>{children}</a>
    </div>
  )
}
