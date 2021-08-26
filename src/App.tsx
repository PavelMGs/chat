import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import Form from './components/Form/Form';
import s from './App.module.scss';
import { host } from './utils/host';

const App = () => {
    const [messages, setMessages] = useState<any>([]);
    const [value, setValue] = useState('');
    const [connected, setConnected] = useState(false);
    const socket = useRef<any>();
    const [username, setUsername] = useState('');
    

    function connect() {
        socket.current = new WebSocket(`wss://${host}`);

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            }

            socket.current.send(JSON.stringify(message));
            console.log('подключение установлено');
        }

        socket.current.onmessage = (event: any) => {
            console.log(event)
            const message = JSON.parse(event.data)
            setMessages((prev: string[]) => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('closed');
            setConnected(false);
        }
        socket.current.onerror = () => {
            console.log('error');
        }
    }

    const sendMessage = () => {
        const message = {
            username,
            text: value,
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        sendMessage();
        setValue('');
    }

    if(!connected) {
        return (
            <div className={s.root}>
                <div 
                >
                    <input
                        type="text"
                        value={username}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }

    return (
        <div className={s.root}>
            <Form
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                value={value}
            />
            <div className={s.messages_block}>
                {
                    messages.map((message: any) => {
                        return message.event === 'connection'
                            ? (<div className={s.connection}>
                                {message.username} is connected
                            </div>)
                            : (<div className={s.message}>
                                {message.username}: {message.text}
                            </div>)
                    })
                }
            </div>
        </div>
    )
}

export default App;
