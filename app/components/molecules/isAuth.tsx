"use client";
import { use, useEffect } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "../../context/authContext";
import { Loader } from "../atoms/Loader";


export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const auth = use(AuthContext);


    useEffect(() => {
      
      if (!auth?.isLoading && !auth?.isLogged) {
        return redirect("/login");
      }
    }, [auth?.isLogged, auth?.isLoading]);


    if (!auth) {
      return null;
    }

    if (auth.isLoading) return <Loader />

    return <Component {...props} />;
  };
}