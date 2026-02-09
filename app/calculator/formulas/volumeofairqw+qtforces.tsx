import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldDescription
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChangeEvent, useState } from "react"
import { Separator } from "@/components/ui/separator"

import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"
import { Label } from "@/components/ui/label"
import { Card, CardContent,CardTitle } from "@/components/ui/card"
import { InfoIcon, LucideFileText } from "lucide-react"
import { LucideUpload } from "lucide-react"

export default function Voaqwqtforce(){
    return(
        <>
            <div>
                <FieldGroup className="mt-5 grid grid-cols-2">  

                    <FieldGroup className=" col-span-2 ">      
                        <Field>
                            <FieldLabel htmlFor="Ks" className=" font-source text-slate-700"> Sensible heat gained (Ks) [W]</FieldLabel>
                            <Input id='Ks' name="Free area of inlet opening (A_inlet) [m²]" type="number"/>
                        </Field>
                         <Field>
                            <FieldLabel htmlFor="h" className=" font-source text-slate-700">Vapor pressure difference (h) [mm Hg]</FieldLabel>
                            <Input id='h' name="Vertical distance between inlet and outlet (h) [m]" type="number"/>
                        </Field>
                         <Field>
                            <FieldLabel htmlFor="t" className=" font-source text-slate-700"> Allowable temperature rise (t) [°C]</FieldLabel>
                            <Input id='t' name="Indoor temperature at height h (t_i) [°C]" type="number" />
                        </Field>
                         <Field>
                            <FieldLabel htmlFor="wo" className=" font-source text-slate-700"> Specific humidity outside (wo)</FieldLabel>
                            <Input id='wo' name="Smaller opening area (A_smaller) [m²]" type="number"/>
                        </Field>
                        <Separator orientation="horizontal" className=" mt-5 mb-5"></Separator>
                    </FieldGroup>

                    </FieldGroup>
                    
                    <FieldGroup className=" grid">
                        <div className=" flex">
                            <LucideFileText className=" mr-2 size-7"/>
                            <code className=" font-sans text-2xl font-semibold">Auto-fill from Weather Data (EPW)</code>
                        </div>
                    <Card className=" bg-slate-50">
                        <CardContent>
                        <Field>
                            <FieldLabel><LucideUpload className=" size-5 ml-1"/>upload .epw file</FieldLabel>
                            <Input id="EPW" type="file" className=" bg-white"/>  
                            <FieldDescription className= " ml-1">Limit 200MB per file • EPW</FieldDescription>
                        </Field>
                        </CardContent>
                     </Card>

                    <Field>
                        <FieldLabel htmlFor="Ks" className=" font-source text-slate-700">Outdoor wind speed (V) [m/h]</FieldLabel>
                        <Input id='Ks' name="Outdoor wind speed (V) [m/h]" type="number"/>
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="h" className=" font-source text-slate-700">Outdoor temperature (t_o) [°C]</FieldLabel>
                        <Input id='h' name="Outdoor temperature (t_o) [°C]" type="number"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="t" className=" font-source text-slate-700">Effectiveness coefficient (K)</FieldLabel>
                        <Input id='t' name="Effectiveness coefficient (K)" type="number" />
                    </Field>
                    
                    </FieldGroup>
                    
                 <Button variant={"outline"} className=" mt-5 w-30 border-slate-300 text-slate-700" >Calculate</Button>
            </div>
        </>
    )
}