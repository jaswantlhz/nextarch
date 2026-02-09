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
    Qs: number;
    Ql_vapor: number;
    Q_humidity: number;
    Qt_vapor: number;
    Qt_humidity: number;
}

export default function Volumeofairheatgain() {

    const [values, setvalues] = useState({
        ks: 0,
        h: 0,
        t: 0,
        wo: 0,
        kl: 0,
        wi: 0,
    })

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handelchange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setvalues(prev => ({ ...prev, [name]: Number(value), }))
    }
    const { ks, h, t, wo, kl, wi } = values

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://jaswantlhz-archbackend.vercel.app/api/volume-air-heat-gain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Ks: ks,
                    Kl: kl,
                    t: t,
                    h: h,
                    wo: wo,
                    wi: wi
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
            <div>
                <FieldGroup className="mt-5 grid grid-cols-2 ">
                    <Field>
                        <FieldLabel htmlFor="Ks" className=" font-source text-slate-700"> Sensible heat gained (Ks) [W]</FieldLabel>
                        <Input id='Ks' name="ks" type="number" onChange={handelchange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="h" className=" font-source text-slate-700">Vapor pressure difference (h) [mm Hg]</FieldLabel>
                        <Input id='h' name="h" type="number" onChange={handelchange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="t" className=" font-source text-slate-700"> Allowable temperature rise (t) [°C]</FieldLabel>
                        <Input id='t' name="t" type="number" onChange={handelchange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="wo" className=" font-source text-slate-700"> Specific humidity outside (wo)</FieldLabel>
                        <Input id='wo' name="wo" type="number" onChange={handelchange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="Kl" className="f font-source text-slate-700"> Latent heat gained (kl) [W]</FieldLabel>
                        <Input id='Kl' name="kl" type="number" onChange={handelchange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="wi" className=" font-source text-slate-700"> Specific humidity inside (wi)</FieldLabel>
                        <Input id='wi' name="wi" type="number" onChange={handelchange} className=" bg-slate-50"/>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Sensible Air Volume (Q<sub>s</sub>)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Qs.toFixed(1)} m³/h</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Latent Air Volume - Vapor (Q<sub>l</sub>)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Ql_vapor.toFixed(1)} m³/h</p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Latent Air Volume - Humidity (Q<sub>l</sub>)</p>
                                    <p className="text-xl font-bold text-slate-900">{result.Q_humidity.toFixed(1)} m³/h</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total - Vapor Method (Q<sub>t</sub>)</p>
                                    <p className="text-xl font-bold text-slate-900">{result.Qt_vapor.toFixed(1)} m³/h</p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-1 gap-4">
                                <div className="text-center bg-blue-100 p-4 rounded-lg">
                                    <p className="text-sm text-slate-600">Total - Humidity Method (Q<sub>t</sub>)</p>
                                    <p className="text-3xl font-bold text-black">{result.Qt_humidity.toFixed(0)} m³/h</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}


            <div className=" mt-5">
                <h4 className="text-center text-blue-600 font-semibold mb-3">
                    Live Formula Preview – See the math with your numbers
                </h4>
                <BlockMath
                    math={`
\\begin{align*}
Q_s &= \\frac{2.9768 \\times K_s}{t} \\quad [m^3/h] \\\\[10pt]
Q_s &= \\frac{2.9768 \\times ${ks}}{${t}} = \\textbf{${result ? result.Qs.toFixed(1) : '---'}} \\text{ m³/h} \\\\[15pt]
Q_l &= \\frac{4127.26 \\times K_l}{h} \\quad [m^3/h \\text{ (vapor)}] \\\\[10pt]
Q_l &= \\frac{4127.26 \\times ${kl}}{${h}} = \\textbf{${result ? result.Ql_vapor.toFixed(1) : '---'}} \\text{ m³/h} \\\\[15pt]
Q_l &= \\frac{K_l}{814 \\times (w_o - w_i)} \\quad [m^3/h \\text{ (humidity)}] \\\\[10pt]
Q_l &= \\frac{${kl}}{814 \\times (${wo.toFixed(3)} - ${wi.toFixed(3)})} = \\textbf{${result ? result.Q_humidity.toFixed(1) : '---'}} \\text{ m³/h} \\\\[15pt]
Q_t &\\approx \\textbf{${result ? Math.max(result.Qt_vapor, result.Qt_humidity).toFixed(0) : '---'}} \\text{ m³/h (total)}
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
