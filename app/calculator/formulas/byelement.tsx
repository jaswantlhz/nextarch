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
import { InfoIcon, LucideFileText, Plus, Trash2 } from "lucide-react"

interface Element {
    U: number;
    A: number;
}

interface ResultData {
    Q_total: number;
    elements_UA: number[];
}

export default function Byelement() {
    const [elements, setElements] = useState<Element[]>([
        { U: 0, A: 0 }
    ]);
    const [deltaT, setDeltaT] = useState<number>(0);
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleElementChange = (index: number, field: 'U' | 'A', value: string) => {
        const newElements = [...elements];
        newElements[index][field] = Number(value);
        setElements(newElements);
    };

    const addElement = () => {
        setElements([...elements, { U: 0, A: 0 }]);
    };

    const removeElement = (index: number) => {
        if (elements.length > 1) {
            setElements(elements.filter((_, i) => i !== index));
        }
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/by-element', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    elements: elements,
                    delta_T: deltaT
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
                <FieldGroup className="mt-5 grid grid-cols-1 gap-4">
                    <Field>
                        <FieldLabel htmlFor="deltaT" className="font-source text-slate-700">
                            Temperature Difference (ΔT) [K]
                        </FieldLabel>
                        <Input
                            id='deltaT'
                            name="deltaT"
                            type="number"
                            value={deltaT}
                            onChange={(e) => setDeltaT(Number(e.target.value))}
                            className=" bg-slate-100"
                        />
                    </Field>
                </FieldGroup>

                <Separator orientation="horizontal" className="mt-5 mb-5" />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-700">Building Elements</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addElement}
                            className="border-slate-300"
                        >
                            <Plus className="mr-2 size-4" />
                            Add Element
                        </Button>
                    </div>

                    {elements.map((element, index) => (
                        <Card key={index} className="bg-slate-50">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-sm font-medium">Element {index + 1}</CardTitle>
                                    {elements.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeElement(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>
                                <FieldGroup className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel className="font-source text-slate-700">
                                            U-value [W/m²·K]
                                        </FieldLabel>
                                        <Input
                                            type="number"
                                            value={element.U}
                                            onChange={(e) => handleElementChange(index, 'U', e.target.value)}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel className="font-source text-slate-700">
                                            Area [m²]
                                        </FieldLabel>
                                        <Input
                                            type="number"
                                            value={element.A}
                                            onChange={(e) => handleElementChange(index, 'A', e.target.value)}
                                        />
                                    </Field>
                                </FieldGroup>
                            </CardContent>
                        </Card>
                    ))}
                </div>

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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Total Heat Load (Q<sub>total</sub>)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Q_total} W</p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div>
                                <p className="text-sm font-semibold text-slate-700 mb-2">Element UA Values:</p>
                                {result.elements_UA.map((ua, index) => (
                                    <div key={index} className="flex justify-between py-1">
                                        <span className="text-slate-600">Element {index + 1}:</span>
                                        <span className="font-mono text-slate-900">{ua} W/K</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="mt-5">
                <h4 className="text-center text-blue-600 font-semibold mb-3">
                    Live Formula Preview – See the math with your numbers
                </h4>
                <BlockMath
                    math={`
\\begin{align*}
${elements.map((elem, idx) =>
                        `UA_{${idx + 1}} &= U_${idx + 1} \\times A_${idx + 1} = ${elem.U} \\times ${elem.A} = ${(elem.U * elem.A).toFixed(2)} \\text{ W/K} \\\\[8pt]`
                    ).join('\n')}
UA_{total} &= ${elements.map((elem, idx) => `UA_{${idx + 1}}`).join(' + ')} \\\\[8pt]
UA_{total} &= ${elements.map(elem => (elem.U * elem.A).toFixed(2)).join(' + ')} = ${elements.reduce((sum, elem) => sum + (elem.U * elem.A), 0).toFixed(2)} \\text{ W/K} \\\\[12pt]
Q_{total} &= UA_{total} \\times \\Delta T \\\\[8pt]
Q_{total} &= ${elements.reduce((sum, elem) => sum + (elem.U * elem.A), 0).toFixed(2)} \\times ${deltaT} \\\\[8pt]
Q_{total} &= \\textbf{${result ? result.Q_total.toFixed(2) : '---'}} \\text{ W}
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