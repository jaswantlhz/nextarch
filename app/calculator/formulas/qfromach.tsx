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
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { InfoIcon, LucideFileText } from "lucide-react"
import { LucideUpload } from "lucide-react"

interface ResultData {
    Q: number;
}

export default function Qfromach() {
    const [values, setValues] = useState({
        ACH: 0,
        V: 0,
        rho: 1.2,
        Cp: 1005.0,
        delta_T: 0,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: Number(value) }));
    };

    const { ACH, V, rho, Cp, delta_T } = values;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://archbackend.vercel.app/api/q-from-ach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ACH: ACH,
                    V: V,
                    rho: rho,
                    Cp: Cp,
                    delta_T: delta_T
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
            <h1 className=" font-source font-semibold">Calculates Q which is the amount of air supplied to or removed from a space.</h1>
            <div>
                <FieldGroup className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="ACH" className="font-source text-slate-700">
                            Air Changes per Hour (ACH)
                        </FieldLabel>
                        <Input id='ACH' name="ACH" type="number" onChange={handleChange} className=" bg-slate-50" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="V" className="font-source text-slate-700">
                            Room Volume (V) [m³]
                        </FieldLabel>
                        <Input id='V' name="V" type="number" onChange={handleChange} className=" bg-slate-50" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="rho" className="font-source text-slate-700">
                            Air Density (ρ) [kg/m³]
                        </FieldLabel>
                        <Input id='rho' name="rho" type="number" value={rho} onChange={handleChange} className=" bg-slate-50" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="Cp" className="font-source text-slate-700">
                            Specific Heat Capacity (C<sub>p</sub>) [J/kg·K]
                        </FieldLabel>
                        <Input id='Cp' name="Cp" type="number" value={Cp} onChange={handleChange} className=" bg-slate-50" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="delta_T" className="font-source text-slate-700">
                            Temperature Difference (ΔT) [K]
                        </FieldLabel>
                        <Input id='delta_T' name="delta_T" type="number" onChange={handleChange} className=" bg-slate-50" />
                    </Field>
                </FieldGroup>
                <Button
                    variant={"destructive"}
                    className="mt-5 w-30 border-slate-300 "
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
                                    <p className="text-sm text-slate-600">Heat Load (Q)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Q} W</p>
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
Q &= \\frac{ACH \\times V \\times \\rho \\times C_p \\times \\Delta T}{3600} \\\\[10pt]
Q &= \\frac{${ACH} \\times ${V} \\times ${rho} \\times ${Cp} \\times ${delta_T}}{3600} \\\\[10pt]
Q &= \\textbf{${result ? result.Q.toFixed(0) : '---'}} \\text{ W}
\\end{align*}
`}
                />
                <p className="text-center text-sm text-slate-500 mt-2">
                    Equation updates live as you change any input
                </p>
            </div>


        </>
    )
}