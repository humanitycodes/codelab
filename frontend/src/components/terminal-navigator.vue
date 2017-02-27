<template>
  <div>
    <div class="form-row">
      <div class="form-group terminal-game-instructions">
        Navigate to the capital of {{ currentStateGoal }}.
      </div>
      <div class="form-group terminal-game-points">
        <span>⭐️&nbsp;&nbsp;{{ points }}</span>
      </div>
    </div>
    <div class="terminal-emulator" @click="$refs.input.focus()">
      <span ref="singleChar" class="test-chars">x</span>
      <span ref="doubleChar" class="test-chars">xx</span>
      <span ref="slicedChars" class="test-chars">
        {{ slicedCommand }}
      </span>
      <div class="terminal-title-bar">Terminal</div>
      <div class="terminal-emulator-content">
        <div class="form-row">
          <div class="form-group terminal-current-path">
            {{ displayedCurrentPath }}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group terminal-command-triangle">
            ▶
          </div>
          <div class="form-group terminal-command-input">
            <input
              ref="input"
              v-model="command"
              @keydown.enter="enterCommand"
              @keydown.prevent.up="upHistory"
              @keydown.prevent.down="downHistory"
              @keydown.prevent.tab="tabComplete"
              @keydown="updateCaret"
            >
            <span
              class="terminal-command-caret"
              :style="{
                left: caretOffset + 'px',
                width: caretWidth + 'px'
              }"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group terminal-output">
            <pre>{{ output }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userGetters } from '@state/helpers'
import buildDirectoryTree from '@helpers/utils/directory-tree-builders/us-geography'
const stateCapitolsDirectoryTree = buildDirectoryTree()
const randomStateGoal = currentStateGoal => {
  const getRandomState = () => {
    const randomState = stateCapitolsDirectoryTree.children[Math.floor(Math.random() * stateCapitolsDirectoryTree.children.length)].name
    return currentStateGoal === randomState
      ? getRandomState()
      : randomState
  }
  return getRandomState()
}

// TODO:
// - mv
// - rmdir
// - rm (-rf)

export default {
  data () {
    return {
      currentPath: [''],
      command: '',
      output: '',
      commandSelectionStart: 0,
      caretOffset: 0,
      caretWidth: 0,
      currentStateGoal: randomStateGoal(),
      points: 0,
      commandHistory: [],
      nextHistoryIndex: 0,
      cachedUnenteredCommand: false
    }
  },
  computed: {
    ...userGetters,
    username () {
      return this.currentUser
        ? this.currentUser.profile.email.replace(/@.+/, '')
        : 'user'
    },
    directoryTree () {
      return {
        name: '',
        children: [{
          name: 'Users',
          children: [{
            name: this.username,
            children: [
              { name: 'Documents' },
              { name: 'Pictures' },
              { name: 'Music' },
              { name: 'Downloads' },
              stateCapitolsDirectoryTree
            ]
          }]
        }]
      }
    },
    states () {
      return stateCapitolsDirectoryTree.children
    },
    currentCityGoal () {
      return this.states
        .find(dir => dir.name === this.currentStateGoal)
        .children[0]
        .name
    },
    currentDir () {
      return this.findDirectory(this.currentPath)
    },
    homePath () {
      return ['', 'Users', this.username]
    },
    homePathString () {
      return this.homePath.join('/')
    },
    displayedCurrentPath () {
      const path = this.currentPath
        .join('/')
        .replace(this.homePathString, '~')
      return path === '' ? '/' : path
    },
    slicedCommand () {
      return this.command
        .slice(0, this.commandSelectionStart)
        .replace(/\s/g, '_')
    }
  },
  watch: {
    command: 'updateCaret'
  },
  created () {
    this.currentPath = this.homePath
  },
  mounted () {
    this.$nextTick(() => {
      this.caretWidth = this.$refs.doubleChar.offsetWidth - this.$refs.singleChar.offsetWidth + 1
    })
  },
  methods: {
    enterCommand () {
      if (this.cachedUnenteredCommand) {
        this.commandHistory.shift()
        this.cachedUnenteredCommand = false
      }
      this.commandHistory.unshift(this.command)
      this.nextHistoryIndex = 0
      const textCommand = this.command
      this.command = ''
      if (!textCommand.trim().length) {
        this.output = ''
        return
      }
      const command = this.parseCommand(textCommand)
      if (command.name === 'cd') {
        const pathString = this.processPathArg(command.args)
        if (!pathString) return
        this.currentPath = this.findPath(pathString)
        if (this.currentCityGoal === this.currentPath[this.currentPath.length - 1]) {
          this.output = `You made it to ${this.currentCityGoal}! +1 Point ⭐️`
          this.points++
          this.currentStateGoal = randomStateGoal(this.currentStateGoal)
          this.output += `\nNow try navigating to the capitol of ${this.currentStateGoal}.`
        } else {
          this.output = ''
        }
        return
      }
      if (command.name === 'pwd') {
        this.output = '/' + this.currentPath.slice(1).join('/')
        return
      }
      if (command.name === 'ls') {
        if (!this.currentDir.children) return
        this.output = this.currentDir.children.map(dir => {
          return dir.name
        }).sort().join('   ')
        return
      }
      if (command.name === 'mkdir') {
        if (command.args.trim()[0] === '-') {
          this.output = 'Sorry. This terminal emulator does not support flags for mkdir.'
          return
        }
        const pathString = this.processPathArg(command.args)
        if (!pathString) return
        let folderName = ''
        const basePathString = pathString.replace(/\/?[^/]+\/?$/, match => {
          folderName = match.replace('/', '')
          return ''
        }).trim()
        if (!folderName) return
        const path = basePathString
          ? this.findPath(basePathString)
          : this.currentPath
        const dir = this.findDirectory(path)
        dir.children = (dir.children || [])
        dir.children.push({ name: folderName })
        return
      }
      this.output = 'Command not found: ' + textCommand
    },
    parseCommand (command) {
      const matches = command.trim().match(/^(\w+)(?:\s+(.+?))?(\/)?$/)
      return {
        name: matches[1],
        args: matches[2],
        trailingSlash: matches[3]
      }
    },
    processPathArg (arg) {
      arg = arg.replace(/~/g, this.homePathString)
      let unescapedSpaceFound = false
      arg.replace(/ /g, (_, offset) => {
        if (arg[offset - 1] !== '\\') {
          unescapedSpaceFound = true
        }
      })
      if (unescapedSpaceFound) {
        this.output = 'Spaces in filenames need to be "escaped" in the terminal. That means putting a \\ before the space.'
        return
      }
      arg = arg.replace(/\\ /g, ' ')
      return arg
    },
    updateCaret () {
      setTimeout(() => {
        const newSelectionStart = this.$refs.input.selectionStart
        this.commandSelectionStart = newSelectionStart
        this.$nextTick(() => {
          this.caretOffset = this.$refs.slicedChars.offsetWidth
        }, 0)
      }, 0)
    },
    findPath (path) {
      const fullPath = /^\//.test(path)
        ? path.split('/')
        : this.currentPath.concat(path.split('/'))
      const dirHistory = []
      const newPath = []
      const recursiveFindDirectory = dir => {
        const path = fullPath.shift()
        if (path === '.' || path === '') {
          return recursiveFindDirectory(dir)
        }
        if (path === '..') {
          if (!newPath.length) newPath.push('')
          if (!dirHistory.length) return
          dir = dirHistory[dirHistory.length - 1]
          dirHistory.pop()
          newPath.pop()
          return recursiveFindDirectory(dir)
        }
        newPath.push(dir.name)
        const childDir = dir.children.find(childDir => {
          return childDir.name === path
        })
        if (childDir) {
          if (fullPath.length) {
            dirHistory.push(dir)
            return recursiveFindDirectory(childDir)
          } else {
            newPath.push(childDir.name)
            return dir
          }
        }
      }
      recursiveFindDirectory(this.directoryTree)
      return newPath
    },
    findDirectory (fullPath) {
      if (fullPath.length === 1) return this.directoryTree
      const clonedPath = fullPath.slice(1)
      const recursiveFindDirectory = dir => {
        const name = clonedPath.shift()
        const childDir = dir.children.find(childDir => {
          return childDir.name === name
        })
        if (clonedPath.length) {
          return recursiveFindDirectory(childDir)
        } else {
          return childDir
        }
      }
      return recursiveFindDirectory(this.directoryTree)
    },
    tabComplete () {
      const command = this.parseCommand(this.command)
      if (command.name === 'cd' || command.name === 'mkdir') {
        let partialName = ''
        let matchingDirs
        if (command.args) {
          const establishedPath = command.trailingSlash
            ? command.args
            : command.args.replace(/\/[^/]+$/, match => {
              partialName = match.slice(1)
              return ''
            })
          const fullEstablishedPath = partialName || command.trailingSlash
            ? this.findPath(establishedPath)
            : this.currentPath
          const foundDir = this.findDirectory(fullEstablishedPath)
          if (!foundDir || !foundDir.children) return
          if (!command.trailingSlash) {
            partialName = partialName || establishedPath
          }
          if (foundDir.children.length === 1) {
            matchingDirs = foundDir.children
          } else {
            matchingDirs = foundDir.children.filter(dir => {
              return dir.name.toLowerCase().indexOf(partialName.toLowerCase()) === 0
            })
          }
          if (matchingDirs.length !== 1) return
          this.command = this.command.replace(
            new RegExp(partialName + '$'),
            matchingDirs[0].name.replace(/ /g, '\\ ')
          )
        } else {
          if (!this.currentDir.children || this.currentDir.children.length !== 1) return
          this.command = command.name + ' ' + this.currentDir.children[0].name
        }
        const input = this.$refs.input
        this.$nextTick(() => {
          input.selectionStart = input.selectionEnd = 10000
        })
      }
    },
    upHistory () {
      if (!this.commandHistory.length) return
      if (
        this.nextHistoryIndex === 0 &&
        this.commandHistory[0] !== this.command
      ) {
        this.commandHistory.unshift(this.command)
        this.cachedUnenteredCommand = true
      }
      if (this.commandHistory.length - 1 > this.nextHistoryIndex) {
        this.command = this.commandHistory[++this.nextHistoryIndex]
      }
    },
    downHistory () {
      if (!this.commandHistory.length) return
      if (this.nextHistoryIndex > 0) {
        this.command = this.commandHistory[--this.nextHistoryIndex]
      }
      if (this.nextHistoryIndex === 0 && this.cachedUnenteredCommand) {
        this.commandHistory.shift()
        this.cachedUnenteredCommand = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'
$terminal-line-height = 30px
$terminal-default-color = #CFCFCA
$terminal-titlebar-height = 22px
$terminal-border-radius = 4px

.terminal-game-instructions
  color: $design.branding.success.dark
.terminal-game-points
  width: auto
  white-space: nowrap
.terminal-emulator
  border-radius: $terminal-border-radius
  border-top-left-radius: $terminal-border-radius + $terminal-titlebar-height
  border-top-right-radius: $terminal-border-radius + $terminal-titlebar-height
  background-color: #26292C
  font-family: 'Operator Mono', 'Fira Code', 'Ubuntu Mono', 'Droid Sans Mono', 'Liberation Mono', 'Source Code Pro', Menlo, Consolas, Courier, monospace
  color: $terminal-default-color
.terminal-title-bar
  border-top-left-radius: $terminal-border-radius
  border-top-right-radius: $terminal-border-radius
  height: $terminal-titlebar-height
  line-height: $terminal-titlebar-height
  font-size: $terminal-titlebar-height * .7
  text-shadow: 0 1px 0 #e5e5e5
  text-align: center
  background: linear-gradient(to bottom, #ebebeb 0%, #d5d5d5 100%)
  color: #212121
.terminal-emulator-content
  padding: $design.layout.gutterWidth
.terminal-emulator .form-row
  margin-top: 0
  margin-bottom: 0
.terminal-command-triangle
  width: 10px
  flex-grow: 0
  > span
    color: #BDC0BF
    line-height: $terminal-line-height
.terminal-command-input
  margin-left: 0
  position: relative
  input
    position: absolute
    top: .2em
    height: 1.2em
    line-height: $terminal-line-height
    padding: 0
    border: none
    background-color: transparent
    color: transparent
    text-shadow: 0 0 0 $terminal-default-color
    -webkit-text-fill-color: transparent
    pointer-events: none
    &::-webkit-input-placeholder
      text-shadow: none
      color: $terminal-default-color
      -webkit-text-fill-color: initial
  .terminal-command-caret
    position: absolute
    top: .2em
    height: 1.2em
    background-color: rgba(255,255,255,.5)
.terminal-current-path
  color: #84B2CB
.test-chars
  position: fixed
  top: -1000px
.terminal-output pre
  white-space: pre-wrap
</style>
