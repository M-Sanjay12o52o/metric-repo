"use client"

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Props = {};

type User = {
    id: string;
    name: string;
}

const Create = (props: Props) => {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/client')
        }
    })

    const [sessionId, setSessionId] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userName, setUserName] = useState<string | null | undefined>(undefined);
    const [userList, setUserList] = useState<User[]>([]);

    const showUsers = (users: User[]) => {
        if (users) {
            console.log("Users from showUsers: ", users)
            setUserList(users);
        }
    }

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

        socketInstance.on("userList", ({ users }: { users: User[] }) => {
            console.log("users from socket.on: ", users)
            showUsers(users);
        })

        // Clean up the socket on component unmount
        return () => {
            socketInstance.disconnect();
        };
    }, [session]);

    const createRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (sessionId) {
            socket?.emit("createRoom", {
                userName: userName,
                sessionId: sessionId,
            });
        }
    };

    return (
        <div className='m-20'>
            {userList.length > 0 ? (
                <div className='mt-8'>
                    <p>Connected Users:</p>
                    <ul>
                        {userList.map((user) => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <form onSubmit={createRoom}>
                    <p>Create a session</p>
                    <input
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                        className='border-2 border-black block mb-4'
                        type="text"
                    />
                    <button type="submit" className='w-32 h-8 bg-blue-700 rounded-lg'>
                        Create
                    </button>
                </form>
            )}
        </div>
    );
};

export default Create;
