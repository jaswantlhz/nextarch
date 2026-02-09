import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChangeEvent, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

export default function Volumeofairheatgain(){
        
    const [values , setvalues] = useState({
        ks: 0,
        h:  0,
        t:  0,
        wo: 0,
        kl: 0,
        wi: 0,
    })

    const handelchange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name , value} = e.target
        setvalues(prev => ({ ...prev, [name]: Number(value),}))
    }
    const {ks,h,t,wo,kl,wi} = values
    

    return(
        <>
            <div>
                <FieldGroup className="mt-5 grid grid-cols-2 ">        
                        <Field>
                        <FieldLabel htmlFor="Ks" className=" font-source text-slate-700"> Sensible heat gained (Ks) [W]</FieldLabel>
                        <Input id='Ks' name="ks" type="number" onChange={handelchange}/>
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="h" className=" font-source text-slate-700">Vapor pressure difference (h) [mm Hg]</FieldLabel>
                        <Input id='h' name="h" type="number" onChange={handelchange}/>
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="t" className=" font-source text-slate-700"> Allowable temperature rise (t) [°C]</FieldLabel>
                        <Input id='t' name="t" type="number" onChange={handelchange} />
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="wo" className=" font-source text-slate-700"> Specific humidity outside(wo)</FieldLabel>
                        <Input id='wo' name="wo" type="number" onChange={handelchange}/>
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="Kl" className="f font-source text-slate-700"> Latent heat gained(kl) [W]</FieldLabel>
                        <Input id='Kl' name="kl" type="number" onChange={handelchange}/>
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="wi" className=" font-source text-slate-700"> Specific humidity inside(wi)</FieldLabel>
                        <Input id='wi' name="wi" type="number" onChange={handelchange}/>
                    </Field>
                 </FieldGroup>
                 <Button variant={"outline"} className=" mt-5 w-30 border-slate-300 text-slate-700" >Calculate</Button>
            </div>

            
            <div className=" mt-5">
                <BlockMath
        math={`
\\begin{align*}
Q_s &= \\frac{2.9768 K_s}${t} \\\\
Q_l &= \\frac{4127.26 K_l}${h}
\\end{align*}
`}
      />
            </div>
        </>
    )
}