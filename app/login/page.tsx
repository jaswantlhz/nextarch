"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginaction, to_desc } from "../actions/login";
import { redirect } from "next/dist/server/api-utils";
import { startTransition } from "react";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-around">

        <div className="flex-1 flex flex-col min-h-screen sm:h-screen justify-center sm:justify-around px-4 sm:px-0">

          <Card className="h-auto sm:h-100 w-full max-w-md sm:w-100 self-center">

            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription> enter your email below to login </CardDescription>
              <CardAction><Button size={"sm"} variant={"outline"}>Sign up</Button></CardAction>
            </CardHeader>

            <CardContent>
              <form action={loginaction}>
                <div className="flex flex-col gap-6">
                  <div className=" grid gap-2">
                    <Label htmlFor="email"> Email</Label>
                    <Input type="email" placeholder="example@email.com" name="login_email" />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Button size={"sm"} variant={"link"} className="ml-auto"> forgot your password?</Button>
                    </div>
                    <Input type="password" placeholder="Password" name="login_pass" />
                  </div>

                </div>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-2 border-t">
              <Button type="submit" className="w-full" onClick={() => { startTransition(() => { to_desc() }) }}>login</Button>
              <Button variant="outline" className="w-full">login with Google</Button>
            </CardFooter>

          </Card>

        </div>

        <div className="hidden sm:block relative flex-1 text-center">

          <img className="h-dvh w-full rounded-4xl p-1" src="/brutalism.jpg" alt="arch_image" />

          <div className="absolute top-1 right-5 sm:left-195 text-emerald-900 p-5">
            <h1 className="text-5xl sm:text-7xl font-newsreader self-center">Arch</h1>
          </div>

        </div>

      </div>
    </div>

  );
}
