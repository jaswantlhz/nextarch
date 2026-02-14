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
import { Separator } from "@/components/ui/separator"

interface ResultData {
    Q_solar: number;
    effective_SHGC: number;
}

export default function SolarHeatGain() {

    const [values, setvalues] = useState({
        area: 0,
        shgc: 0,
        projection_factor: 1,
        solar_irradiation: 0,
    })

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handelchange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setvalues(prev => ({ ...prev, [name]: Number(value), }))
    }
    const { area, shgc, projection_factor, solar_irradiation } = values

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://archbackend.vercel.app/api/solar-heat-gain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    area: area,
                    SHGC: shgc,
                    projection_factor: projection_factor,
                    solar_irradiation: solar_irradiation,
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error calculating:', error);
            alert('Error calculating. Please ensure the API is running on http://localhost:8000');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className=" font-source font-semibold">Calculates Equivalent Solar Heat Gain through glazing.</h1>
            <div>
                <FieldGroup className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="area" className=" font-source text-slate-700"> Area of Window Glass Glazing (A) [m²]</FieldLabel>
                        <Input id='area' name="area" type="number" onChange={handelchange} className=" bg-slate-50" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="shgc" className=" font-source text-slate-700">Solar Heat Gain Coefficient (SHGC)</FieldLabel>
                        <Input id='shgc' name="shgc" type="number" step="0.01" onChange={handelchange} className=" bg-slate-50" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="projection_factor" className=" font-source text-slate-700"> Projection Factor of Horizontal Shading (PF)</FieldLabel>
                        <Input id='projection_factor' name="projection_factor" type="number" step="0.01" defaultValue={1} onChange={handelchange} className=" bg-slate-50" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="solar_irradiation" className=" font-source text-slate-700"> Solar Irradiation (I) [W/m²]</FieldLabel>
                        <Input id='solar_irradiation' name="solar_irradiation" type="number" onChange={handelchange} className=" bg-slate-50" />
                    </Field>
                </FieldGroup>
                <Button
                    variant={"destructive"}
                    className=" mt-5 w-30 border-slate-300 "
                    onClick={handleCalculate}
                    disabled={loading}
                >
                    {loading ? 'Calculating...' : 'Calculate'}
                </Button>
            </div>
            {result && (
                <Card className="mt-5 bg-blue-50 border-blue-200">
                    <CardContent className="">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Results</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Effective SHGC</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.effective_SHGC.toFixed(4)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Equivalent Solar Heat Gain (Q<sub>solar</sub>)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Q_solar.toFixed(2)} W</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}


            <div className="mt-5 overflow-x-auto">
                <h4 className="text-center text-blue-600 font-semibold mb-3">
                    Live Formula Preview – See the math with your numbers
                </h4>
                <BlockMath
                    math={`
\\begin{align*}
\\text{Effective SHGC} &= \\text{SHGC} \\times \\text{Projection Factor} \\\\[10pt]
\\text{Effective SHGC} &= ${shgc} \\times ${projection_factor} = \\textbf{${result ? result.effective_SHGC.toFixed(4) : '---'}} \\\\[15pt]
Q_{\\text{solar}} &= A \\times \\text{Effective SHGC} \\times I \\quad [W] \\\\[10pt]
Q_{\\text{solar}} &= ${area} \\times ${result ? result.effective_SHGC.toFixed(4) : '---'} \\times ${solar_irradiation} \\\\[10pt]
Q_{\\text{solar}} &= \\textbf{${result ? result.Q_solar.toFixed(2) : '---'}} \\text{ W}
\\end{align*}
`}
                />
                <p className="text-center text-sm text-slate-500 mt-2">
                    Equations update live as you change any input
                </p>
            </div>


        </>
    )
}
