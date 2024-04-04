'use client'
import { useCheckAuth } from "./hooks/useCheckAuth";

export default function Home() {
  const authState = useCheckAuth();
  return (
    <div>
      {authState.user?.username}
    </div>
  )
}