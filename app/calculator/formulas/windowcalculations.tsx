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
import { Card, CardContent } from "@/components/ui/card"

interface ResultData {
    Q: number;
    A?: number;
    Ai: number;
    Ao: number;
}

export default function Windowcalculations() {
    const [equalOpenings, setEqualOpenings] = useState(true);
    const [calcInlet, setCalcInlet] = useState(true);
    const [values, setValues] = useState({
        V_room: 0,
        n_ach: 0,
        K: 0.6,
        V: 0,
        A_effective: 2.0,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: Number(value) }));
    };

    const { V_room, n_ach, K, V, A_effective } = values;
    const calculatedQ = V_room * n_ach;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://jaswantlhz-archbackend.vercel.app/api/window-calculations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    V_room: V_room,
                    n_ach: n_ach,
                    K: K,
                    V: V,
                    equal_opening: equalOpenings,
                    A_effective: equalOpenings ? null : A_effective,
                    calc_inlet: equalOpenings ? null : calcInlet
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
            <div className="">
                <FieldGroup className="mt-5 grid grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="v" className="font-source text-slate-700">
                            Room Volume (V) [m³]
                        </FieldLabel>
                        <Input id='v' name="V_room" type="number" onChange={handleChange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="h" className="font-source text-slate-700">
                            Air Changes per Hour (n)
                        </FieldLabel>
                        <Input id='h' name="n_ach" type="number" onChange={handleChange} className=" bg-slate-50"/>
                    </Field>

                    <Alert className="col-span-1 bg-blue-100 text-cyan-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                        <InfoIcon />
                        <AlertDescription className="text-cyan-900">
                            Calculated Airflow Rate (Q): {calculatedQ.toFixed(2)} m³/h (based on Q = n × V)
                        </AlertDescription>
                    </Alert>

                    <Alert className="col-span-1 bg-blue-100 text-cyan-800">
                        <InfoIcon />
                        <AlertDescription className="text-cyan-900">
                            Design Q: {calculatedQ.toFixed(2)} m³/h
                        </AlertDescription>
                    </Alert>
                </FieldGroup>

                <Separator orientation="horizontal" className="mt-10" />

                <FieldGroup className="mt-5 grid grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="t" className="font-source text-slate-700">
                            Coefficient of flow (K)
                        </FieldLabel>
                        <Input id='t' name="K" type="number" value={K} onChange={handleChange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="wo" className="font-source text-slate-700">
                            Wind speed (Velocity) [m/h]
                        </FieldLabel>
                        <Input id='wo' name="V" type="number" onChange={handleChange} className=" bg-slate-50"/>
                    </Field>
                </FieldGroup>

                <FieldGroup>
                    <Field className="mt-5 grid grid-cols-2">
                        <div className="flex">
                            <Checkbox
                                className="mr-2"
                                id="equal-openings"
                                checked={equalOpenings}
                                onCheckedChange={(checked) => setEqualOpenings(Boolean(checked))}
                            />
                            <FieldLabel htmlFor="equal-openings">Calculate equal openings</FieldLabel>
                        </div>
                    </Field>
                </FieldGroup>

                {equalOpenings ? null : (
                    <>
                        <FieldGroup className="grid grid-cols-1">
                            <Field className="mt-6">
                                <FieldLabel className="font-source text-slate-700">
                                    Effective area (A<sub>effective</sub>) [m²]
                                </FieldLabel>
                                <Input
                                    type="number"
                                    name="A_effective"
                                    value={A_effective}
                                    onChange={handleChange}
                                    className=" bg-slate-50"
                                />
                            </Field>
                        </FieldGroup>

                        <RadioGroup
                            value={calcInlet ? "Inlet" : "Outlet"}
                            onValueChange={(value) => setCalcInlet(value === "Inlet")}
                            className="mt-10 max-w-fit"
                        >
                            <Label className="font-source text-slate-700">Calculate:</Label>
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

                <Button
                    variant={"destructive"}
                    className="mt-5 mb-6 w-30 border-slate-300"
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
                                    <p className="text-sm text-slate-600">Airflow Rate (Q)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Q} m³/h</p>
                                </div>
                                {result.A !== undefined && result.A !== null && (
                                    <div>
                                        <p className="text-sm text-slate-600">Opening Area (A)</p>
                                        <p className="text-2xl font-bold text-slate-900">{result.A} m²</p>
                                    </div>
                                )}
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Inlet Area (A<sub>i</sub>)</p>
                                    <p className="text-xl font-bold text-slate-900">{result.Ai} m²</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Outlet Area (A<sub>o</sub>)</p>
                                    <p className="text-xl font-bold text-slate-900">{result.Ao} m²</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="mt-5">
                <h4 className="text-center text-blue-600 font-semibold mb-3">
                    Live Formula Preview – See the math with your numbers
                </h4>
                {equalOpenings ? (
                    <BlockMath
                        math={`
\\begin{align*}
Q &= V_{room} \\times n_{ach} \\\\[10pt]
Q &= ${V_room} \\times ${n_ach} = \\textbf{${calculatedQ.toFixed(2)}} \\text{ m³/h} \\\\[15pt]
A &= \\frac{Q}{K \\times V} \\quad \\text{(equal openings)} \\\\[10pt]
A &= \\frac{${calculatedQ.toFixed(2)}}{${K} \\times ${V}} = \\textbf{${result && result.A ? result.A.toFixed(3) : '---'}} \\text{ m²} \\\\[10pt]
&\\Rightarrow \\text{Inlet = Outlet = } \\textbf{${result && result.A ? result.A.toFixed(3) : '---'}} \\text{ m²}
\\end{align*}
`}
                    />
                ) : (
                    <BlockMath
                        math={`
\\begin{align*}
\\frac{1}{A_{effective}} &= \\frac{1}{A_i} + \\frac{1}{A_o} \\quad \\text{(unequal openings)} \\\\[10pt]
A_{effective} &= ${A_effective} \\text{ m² (base value)} \\\\[10pt]
A_i &= \\textbf{${result ? result.Ai.toFixed(3) : '---'}} \\text{ m²} \\\\[10pt]
A_o &= \\textbf{${result ? result.Ao.toFixed(3) : '---'}} \\text{ m²}
\\end{align*}
`}
                    />
                )}
                <p className="text-center text-sm text-slate-500 mt-2">
                    Equation updates live as you change any input
                </p>
            </div>

            
        </>
    )
}