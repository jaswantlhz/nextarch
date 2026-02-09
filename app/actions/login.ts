"use server"
import { redirect } from "next/navigation"

export async function loginaction(formdata : FormData){
    const email = formdata.get("login_email")
    const password = formdata.get("login_pass")

    if (email !== 'example@email.com' || password !== 'jaswantzephyr'){
        throw new Error("invalid login")
    }
    else{
    redirect("/description")
    }
}

export async function to_calc(){
    redirect('/calculator')
}