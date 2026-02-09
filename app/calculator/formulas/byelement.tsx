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

export default function Byelement(){
    return(
        <div>
                <FieldGroup className="mt-5 grid grid-cols-2 ">        
                        <Field>
                        <FieldLabel htmlFor="Ks" className=" font-source text-slate-700"> Sensible heat gained (Ks) [W]</FieldLabel>
                        <Input id='Ks' name="ks" type="number"   />
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="h" className=" font-source text-slate-700">Vapor pressure difference (h) [mm Hg]</FieldLabel>
                        <Input id='h' name="h" type="number"   />
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="t" className=" font-source text-slate-700"> Allowable temperature rise (t) [°C]</FieldLabel>
                        <Input id='t' name="t" type="number"    />
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="wo" className=" font-source text-slate-700"> Specific humidity outside(wo)</FieldLabel>
                        <Input id='wo' name="wo" type="number"   />
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="Kl" className="f font-source text-slate-700"> Latent heat gained(kl) [W]</FieldLabel>
                        <Input id='Kl' name="kl" type="number"   />
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="wi" className=" font-source text-slate-700"> Specific humidity inside(wi)</FieldLabel>
                        <Input id='wi' name="wi" type="number"   />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="wi" className=" font-source text-slate-700"> Specific humidity inside(wi)</FieldLabel>
                        <Input id='wi' name="wi" type="number"   />
                    </Field>
                 </FieldGroup>
                 <Button variant={"outline"} className=" mt-5 w-30 border-slate-300 text-slate-700" >Calculate</Button>
            </div>
    )
}