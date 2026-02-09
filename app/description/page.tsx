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
import { useTransition } from "react"
import { to_calc } from "../actions/login"

export default function Description(){
    const [,startTransition] = useTransition()
    return(
        <div>
            <div className="h-dvh w-dvw relative bg-cover" style={{backgroundImage: "url('/curve.jpg')"}}>                
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Card className="relative h-135 w-350 ">
                <CardHeader>
                    <code className=" scroll-m-20 border-b pb-2 text-3xl font-sans font-semibold tracking-tight first:mt-0"> Optimised Window Opening & Combined Ventilation Flow Calculator </code>
                    <code className="leading-7 mt-3 font-sans"> This interactive tool is designed to assist architects, engineers, and building professionals in optimizing window openings and calculating combined ventilation flows. It helps ensure efficient natural ventilation, improved indoor air quality, and enhanced thermal comfort while adhering to established standards for sustainable building design.</code>
                  {/* card content */}
                </CardHeader>
                <CardContent>
                    <code className="leading-7 font-sans"> The calculations in this tool are grounded in established Indian standards and handbooks, including:<br/></code>  
                    <code className="font-semibold font-sans"> SP 41: Handbook on Functional Requirements of Industrial Buildings (Lighting and Ventilation)<br/></code>
                    <code className=" font-sans leading-10">Provides guidelines for natural ventilation strategies, airflow calculations, and opening sizes to achieve adequate air exchange in buildings. <br /></code>
                    <code className=" leading-7 font-sans">IS Codes (Indian Standard Codes) such as:</code>
                    <ul className=" ml-10 list-disc mt-2 mb-5">
                     <li> <code className=" font-sans font-semibold"> IS 7668:1989  </code>  Recommendations for design and construction of natural ventilation systems in buildings.</li>
                     <li> <code className=" font-sans font-semibold"> IS 8837:1977  </code>  Code of practice for design of cooling (evaporative) towers, relevant for integrated ventilation-heat load assessments.</li>
                     <li> <code className=" font-sans font-semibold"> IS 10444:1983 </code> Code of practice for solar heating and cooling systems for buildings, incorporating shade factors and thermal performance.</li>
                    </ul>
                    <code className=" font-sans">These standards emphasize buoyancy-driven (thermal), wind-driven, and combined ventilation mechanisms to minimize energy consumption and promote passive cooling.</code>
                </CardContent>
                <CardFooter className="border-t">
                    <code className=" font-sans"> For more details on standards, refer to official <code className=" font-sans font-semibold">BIS Publications</code>.</code>
                    <Button className="ml-auto" variant={"outline"} onClick={() => {startTransition(()=> {to_calc()})}} > Go to Calculator </Button>
                </CardFooter>
              </Card>
            </div>
        </div>
    )
}