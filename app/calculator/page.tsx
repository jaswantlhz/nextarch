'use client'
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ChangeEvent, useState } from "react"
import { formulatype } from "./types"

import Volumeofairheatgain from "./formulas/volumeofairheatgain"  
import Windowcalculations from "./formulas/windowcalculations"
import Voaqwqtforce from "./formulas/volumeofairqw+qtforces"
import Qfromach from "./formulas/qfromach"
import Byelement from "./formulas/byelement"

export default function Calculator(){

    const [selectedformula , setselectedformula] = useState<formulatype>("")

    const handleformulachange = (e: ChangeEvent<HTMLSelectElement>)=>{
        setselectedformula(e.target.value as formulatype)
    }

    return(
        <>
        <div className="h-dvh w-dvw flex justify-around">
            <div className=" flex ">
                <div className=" container mt-30 ">
                    
                    <div className="">
                        <h1 className=" font-source text-4xl font-semibold">Optimised Window Opening & Combined Ventilation Flow Calculator. <br /></h1>
                    </div>

                    <div className=" my-3">
                        <Label>choose the formula type</Label>
                    </div>
                    
                    <NativeSelect className= " w-svh bg-slate-100" value={selectedformula} 
                                  onChange={handleformulachange}>
                    
                        <NativeSelectOption value={""}>Select Formula</NativeSelectOption>
                        <NativeSelectOption value={"Volumeofairheatgain"}>Volume of Air (Heat Gain)</NativeSelectOption>
                        <NativeSelectOption value={"Windowcalculations"}>Window Calculations</NativeSelectOption>
                        <NativeSelectOption value={"Volumeofairqw+qtforces"}> Volume of Air(Qw + Qt Forces)</NativeSelectOption>
                        <NativeSelectOption value={"Qfromach"}>Q from ACH</NativeSelectOption>
                        <NativeSelectOption value={"Byelement"}>By Element</NativeSelectOption>
                    
                        {/*<NativeSelectOption value={""}></NativeSelectOption>*/}
                    </NativeSelect>

                    <div className=" mt-5 mb-5" >
                        <h1 className=" font-source font-semibold">Calculates sensible and latent air volumes.</h1>
                        {selectedformula === "Volumeofairheatgain" && <Volumeofairheatgain/>}
                        {selectedformula === "Windowcalculations" && <Windowcalculations/>}
                        {selectedformula === "Volumeofairqw+qtforces" && <Voaqwqtforce/>}
                        {selectedformula === "Qfromach" && <Qfromach/>}
                        {selectedformula === "Byelement" && <Byelement/>}
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}