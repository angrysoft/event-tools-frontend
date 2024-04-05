"use client";
import { Loader } from "./components/atoms/Loader";
import { SwitchComponent } from "./components/atoms/SwitchComponent";
import { useCheckAuth } from "./hooks/useCheckAuth";

export default function Home() {
  const auth = useCheckAuth();
  console.log("render home");
  if (auth.isLoading) return <Loader />
  return (
    <SwitchComponent
      user={auth.user}
    />
  );
}
