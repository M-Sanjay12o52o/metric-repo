import { createServer } from "http";
import { Server } from "socket.io";

interface User {
  id: string;
  name: string;
  room: string;
}

const httpServer = createServer();
const ADMIN = "Admin";

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
  },
});

// state for users
const UsersState = {
  users: [] as User[],
  setUsers: function (newUsersArray: any) {
    this.users = newUsersArray;
  },
};

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });

  socket.on("createRoom", ({ userName, sessionId }) => {
    // TODO: createing a session
    console.log(`User ${userName} created a room with session ID ${sessionId}`);
    socket.join(sessionId);
    socket.emit("createRoomSuccess");
  });

  // TODO; Not complete
  socket.on("joinRoom", ({ userName, sessionId }) => {
    const user = activateUser(socket.id, userName, sessionId);
    socket.join(sessionId);
    console.log(`User ${userName} joined a room with session ID ${sessionId}`);
    socket.emit("joinRoomSuccess");

    // update user list for room
    io.to(user.room).emit("userList", {
      users: getUsersInRoom(user.room),
    });

    // To the user who joined
    socket.emit("message", `You have joined the ${sessionId} chat room`);
  });
});

httpServer.listen(3001, () => {
  console.log("Listening on port 3001");
});

const activateUser = (id: string, name: string, room: string) => {
  const user: User = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
};

const getUsersInRoom = (room: string) => {
  return UsersState.users.filter((user) => user.room === room);
};
