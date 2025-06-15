"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const {data:session} = authClient.useSession();
  const router = useRouter();
  
  if (!session) {
    return (
     <p>Loading...</p>
    );
  }

  return (
     <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name || "User"}!</h1>
        <p className="text-lg">Email: {session.user.email}</p>
        <Button className="mt-4" onClick={() => authClient.signOut({fetchOptions: {onSuccess: () => router.push('/sign-in')}})}>SignOut</Button>
      </div>
  );
}

export default HomeView;
