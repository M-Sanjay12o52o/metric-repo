import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

// Add more users to the array
const users = [
  { id: "42", name: "John", password: "nextauth" },
  { id: "43", name: "Jane", password: "password123" },
  { id: "44", name: "Bob", password: "securepass" },
  { id: "45", name: "Alice", password: "qwerty" },
  { id: "46", name: "Charlie", password: "letmein" },
  { id: "47", name: "Eva", password: "123456" },
  { id: "48", name: "David", password: "welcome123" },
  { id: "49", name: "Grace", password: "p@ssw0rd" },
  { id: "50", name: "Henry", password: "pass1234" },
  { id: "51", name: "Isabel", password: "secretPass" },
];

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        // Check if credentials match any user
        const matchingUser = users.find(
          (user) =>
            credentials?.username === user.name &&
            credentials?.password === user.password
        );

        if (matchingUser) {
          return matchingUser;
        } else {
          return null;
        }
      },
    }),
  ],
  // TODO: Custom signin page
  pages: {},
};
