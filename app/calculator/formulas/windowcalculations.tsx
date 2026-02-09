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
import { Separator } from "@/components/ui/separator"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"
import { InfoIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Windowcalculations(){
const [equalOpenings, setEqualOpenings] = useState(true)
    return(
        <>
            <div className="">
                <FieldGroup className="mt-5 grid grid-cols-2 ">

                        <Field>
                        <FieldLabel htmlFor="v" className=" font-source text-slate-700"> Room Volume (V) [m³]</FieldLabel>
                        <Input id='v' name="v" type="number"/>
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="h" className=" font-source text-slate-700">Air Changes per Hour (n)</FieldLabel>
                        <Input id='h' name="h" type="number"  />
                    </Field>

                    <Alert className=" col-span-1 bg-blue-100 text-cyan-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                      <InfoIcon/>
                      <AlertDescription className=" text-cyan-900">Calculated Airflow Rate (Q) : 35.00 m³/h (based on Q = n × V)
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className=" col-span-1 bg-blue-100 text-cyan-800 ">
                      <InfoIcon/>
                      <AlertDescription className=" text-cyan-900"> Design Q: 35.00 m³/h </AlertDescription>
                    </Alert>

                </FieldGroup>
                
                <Separator orientation="horizontal" className=" mt-10"></Separator>
                
                <FieldGroup className="mt-5 grid grid-cols-2 ">
                     <Field>
                        <FieldLabel htmlFor="t" className=" font-source text-slate-700">Coefficient of flow (K)</FieldLabel>
                        <Input id='t' name="t" type="number"   />
                    </Field>
                     <Field>
                        <FieldLabel htmlFor="wo" className=" font-source text-slate-700"> Wind speed (Velocity) [m/h]</FieldLabel>
                        <Input id='wo' name="wo" type="number"  />
                    </Field>
                </FieldGroup>
                
                <FieldGroup>
                    <Field className="mt-5 grid grid-cols-2">
                        <div className= "flex"> 
                            <Checkbox className="mr-2" id="equal-openings" checked={equalOpenings} onCheckedChange={(checked) => setEqualOpenings(Boolean(checked))}/>
                            <FieldLabel htmlFor="equal-openings">Calculate equal openings</FieldLabel>
                        </div>
                    </Field>
                </FieldGroup>
                    {equalOpenings ?(
                    
                    null
                    ) : ( 
                    <>
                        <FieldGroup className=" grid grid-cols-1">
                            <Field className=" mt-6">
                                <FieldLabel className=" font-source text-slate-700">Effective area (A_effective) [m²]</FieldLabel>
                                <Input type="number" defaultValue={2.0} />
                            </Field>
                        </FieldGroup>

                        <RadioGroup defaultValue="option-one" className=" mt-10 max-w-fit">
                            <Label className=" font-source text-slate-700">Calculate:</Label>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="Inlet" id="option-one" />
                            <Label htmlFor="option-one" className="font-source text-slate-700">Inlet</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="Outlet" id="option-two" />
                            <Label htmlFor="option-two" className="font-source text-slate-700">Outlet</Label>
                          </div>
                        </RadioGroup>
                    </>    
                    )}
                <Button variant={"outline"} className=" mt-5 mb-6 w-30 border-slate-300 text-slate-700" >Calculate</Button>
            </div>
            
        </>
    )
}