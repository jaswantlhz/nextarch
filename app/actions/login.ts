"use server"
import { redirect } from "next/navigation"

export async function loginaction(_prev: unknown, formdata: FormData) {
    const email = formdata.get("login_email")
    const password = formdata.get("login_pass")

    if (email !== 'example@email.com' || password !== 'quantx') {
        return { error: "Invalid operator ID or access key" }
    }
    redirect("/description")
}

export async function to_desc() {
    redirect('/description')
}

export async function to_calc() {
    redirect('/calculator')
}