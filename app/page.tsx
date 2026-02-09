"use client"
import { useRouter } from "next/navigation"
import { redirect } from "next/navigation"
export default function HomePage(){
    const router = useRouter()
    return(
        redirect("/login")
    )
}