"use client";
import Image from "next/image";
import { useState } from "react";
import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"; // Adjust the import path as necessary

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const {data:session} = authClient.useSession();

  const onSubmit = async (e: React.FormEvent) => {
    authClient.signUp.email({
      email,
      password,
      name
    },{
      onError: (error) => {
        window.alert("Something went wrong");
      },
      onSuccess: (data) => {
        console.log("Sign up successful:", data);
      }
    })
  }
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name || "User"}!</h1>
        <p className="text-lg">Email: {session.user.email}</p>
        <Button className="mt-4" onClick={() => authClient.signOut()}>SignOut</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-gray-100 p-4">
        <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
        />
        <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
        />
        <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
        />
        <Button onClick={onSubmit}>Register</Button>
    </div>
  );
}
