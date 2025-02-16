'use client'

import { addChatHistory, getChatHistoryStream, getSession } from '@/lib/firebase'
import MoveWallet from '@/lib/move'
import Utils from '@/lib/util'
import { useChat } from 'ai/react'
import { Send, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Markdown from 'react-markdown'
import { Button } from '../../components/button';
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { get } from 'http'



const getSessionId = () => {
  const id = sessionStorage.getItem('sessionId');
  if (id) {
    sessionStorage.setItem('sessionId', Utils.generateRef());
    return getSessionId();
  };
}
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat()
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [sessionId, setSessionId] = useState<string>();
  const [account, setAccount] = useState<{ address: string } | null>();

  const [history, setHistory] = useState<any[]>([]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom]) // Added scrollToBottom to dependencies

  useEffect(() => {
    const init = async () => {
      if (!messages.length || !account?.address || !sessionId) return;
      console.log(sessionId)
      addChatHistory({ title: messages[0].content.split(' ').slice(0, 4).join(' '), wallet: account?.address.toString(), sessionId: sessionId, role: 'user', content: JSON.stringify(messages) })
    };
    if (account?.address && messages.length) {
      init();
    }

    if (sessionId && !messages.length && account?.address) {
      getSession(account.address.toString(), sessionId).then((data: any) => { if (data) { setMessages(JSON.parse(data.content)) } });
    }
  }, [sessionId, account, messages])

  useEffect(() => {
    try {
      if (account?.address) {
        console.log({ account });
        getChatHistoryStream(account.address.toString()).onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          setHistory(data);
        })
      }

    } catch (error) {
      console.log({ error });
    }
  }, [account])

  useEffect(() => {
    const params = location.href.split('?')[1];
    if (params) {
      const id = params.split('=')[1];
      console.log({ id });
      if (!id) {
        location.href = '/chat?id=' + Utils.generateRef();
      } else {
        setSessionId(id);
      }
    } else {
      location.href = '/chat?id=' + Utils.generateRef();
    }
    connectWallet();
  }, [])

  const connectWallet = async () => {
    const result = await MoveWallet.connect();
    setAccount(result.args);
    console.log({ res1: result.args, account, result });
    // alert("wallet connected");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      setIsTyping(true)

      try {
        await handleSubmit(e);
        setIsTyping(false)
      } catch (error) {
        setIsTyping(false)
      }

    }
  }

  const startNewChat = () => {
    const sessionId = Utils.generateRef();
    location.href = '/chat?id=' + sessionId;
    setSessionId(sessionId);
    setMessages([]);
    // location.reload();
  }
  const loadSession = (sessionId: string) => {
    location.href = '/chat?id=' + sessionId;
    setSessionId(sessionId);
    setMessages([]);
    // location.reload();
  }
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line in textarea
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen w-screen backdrop-blur-[2px] flex-row">
      <div className="  h-screen  bg-gray-950  w-[15%] hidden md:flex flex-col items-center content-start justify-start pt-5 backdrop-blur-[10px]">
        <div className='flex flex-col items-start   justify-center space-y-2'>
          <p className="bg-amber-600 font-bold text-sm cursor-pointer  rounded-lg p-2" onClick={connectWallet} >{!account?.address ? "Connect Wallet" : account.address.toString().substring(0, 12)}</p>
        </div>
        <ul className="flex flex-col mt-10 w-full space-y-2.5 p-4">
          <p>Chat History</p>
          {history.map((item, index) => (
            <li key={index} className="cursor-pointer text-center   w-full bg-gray-800 p-2 rounded-lg" onClick={()=>loadSession(item.id)}>{item.title}</li>
          ))}
        </ul>
      </div>
      <div className="flex h-screen md:w-[75%] w-full   flex-col m-auto items-center justify-center ">
        {/* <div className="h-full w-[60%]"> */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4  w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex    w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Markdown remarkPlugins={[remarkGfm]}
                components={{
                  code(props) {
                    const { children, className, node, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"

                        language={match[1]}
                        style={dark}
                      >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                    ) : (
                      <code {...rest} className={className}>
                        {children}
                      </code>
                    )
                  }
                }}
                className={`max-w-xs md:text-md backdrop-blur-lg sm:text-sm text-xs rounded-lg p-3 md:max-w-[60%] lg:max-w-[60%] xl:max-w-[80%] ${message.role === 'user'
                  ? 'bg-amber-500 text-white'
                  : 'bg-black  text-gray-100'
                  }`}
              >
                {message.content}
              </Markdown>
            </div>
          ))}
          {(isLoading ?
            <div className="flex justify-start">
              <div className="rounded-lg p-3 text-gray-100  animate-bounce">
                Ai is moving 🤔 ...
              </div>
            </div> : <></>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={onSubmit} className="bg-gray w-full md:w-[80%]  p-4">
          {/* <div>
            <p>Select Contract Template</p>
            <div>

            </div>
          </div> */}
          <div className="flex  items-end space-x-2">
            <button
              type="button"
              onClick={startNewChat}
              className="rounded-full bg-amber-500 p-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"

            >  <Plus size={20} />
            </button>
            <TextareaAutosize
              value={input}
              onChange={handleInputChange}
              placeholder="Gmove, how can i help you?"
              minRows={1}
              maxRows={5}
              onKeyDown={handleKeyDown}
              className="flex-1 resize-none rounded-lg border p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-amber-500 p-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        {/* </div> */}
      </div>
    </div>
  )
}
