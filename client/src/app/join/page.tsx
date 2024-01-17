"use client"

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Props = {};

const Join = (props: Props) => {
    const [message, setMessage] = useState<string>("")
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/client')
        }
    })

    const [sessionId, setSessionId] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userName, setUserName] = useState<string | null | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        const socketInstance = io('http://localhost:3001');
        setSocket(socketInstance);
        setUserName(session?.user?.name)

        console.log('Connecting to server');

        socketInstance.on("connect", () => {
            console.log('Connected to server');
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socketInstance.on("joinRoomSuccess", () => {
            console.log("hello from joinRoomSuccess client side")
            // router.push('/answer');
        });

        socketInstance.on("message", (data) => {
            setMessage(data);
        })

        // Clean up the socket on component unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (sessionId) {
            socket?.emit("joinRoom", {
                userName: userName,
                sessionId: sessionId,
            });
        }
    };

    return (
        <div className='m-20'>
            {message ? (<h1>{message}</h1>) : (
                <form onSubmit={joinRoom}>
                    <p>Join a session</p>
                    <input
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                        className='border-2 border-black block mb-4'
                        type="text"
                    />
                    <button type="submit" className='w-32 h-8 bg-blue-700 rounded-lg'>
                        Join
                    </button>
                </form >
            )}
        </div >
    );
};

export default Join;
