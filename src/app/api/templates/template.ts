import fsAsync from 'fs/promises'
import { LaunchPad } from './files/launchpad'
import { NFT_TEMPLATE } from './files/nft'
import { SimpleToken } from './files/simple_token'
import { TodoList } from './files/todo_list'

export type TEMPLATE = {
  name: string
  title: string
  image: string
  desc: string
  content: string
}

const NFT = {
  name: 'NFT',
  title: 'NFT Minting Module - Move Language',
  image: '/contract/nft.png',
  desc: 'This Move module enables the creation and minting of NFTs (Non-Fungible Tokens) on the Movement blockchain.',
  content: NFT_TEMPLATE,
}

const LUNCH_PAD = {
  name: 'Launch Pad',
  title: 'Launchpad Module built on Movement using Move',

  desc: 'The Launchpad Module allows users to create fungible assets (FAs) with various configurations such as max supply, mint limits, and fees. It includes functionalities for admin control, FA creation, and minting events.',
  image: '/contract/launchPad.png',
  content: LaunchPad,
}

const SIMPLE_TOKEN = {
  name: 'Simple Token',
  title: 'Creating a Token on Movement Blockchain',
  desc: 'This guide explains how to create and deploy a token on the Movement blockchain using the Move programming language.',
  image: '/contract/simple_token.png',
  content: SimpleToken,
}

const TODO_LIST = {
  name: 'Todo List',
  title: 'Advanced Todo List on Movement Blockchain',
  desc: 'This project implements an advanced todo list using the Move programming language. It allows users to create todo lists, add todos, mark them as complete, and retrieve their lists.',

  image: '/contract/todoList.png',
  content: TodoList,
}

export const readData = async (filePath: string) => {
  try {
    console.log('filePath', filePath)
    const data = await fsAsync.readFile(filePath, 'utf-8')
    return data
  } catch (error) {
    throw Error('Error reading file: ' + error)
  }
}

export const getTemplate = () => {
  return [SIMPLE_TOKEN, NFT, LUNCH_PAD, TODO_LIST]
}
