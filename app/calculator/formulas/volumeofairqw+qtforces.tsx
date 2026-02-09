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
    Qt: number;
    Qw: number;
    Q_combined: number;
}

export default function Voaqwqtforce() {
    const [values, setValues] = useState({
        A_inlet: 0,
        h: 0,
        t_i: 0,
        t_o: 0,
        A_smaller: 0,
        V: 0,
        K: 0.6,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);
    const [epwUploaded, setEpwUploaded] = useState(false);
    const [epwYears, setEpwYears] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState({
        year: 2024,
        month: 1,
        day: 1,
        hour: 12,
    });
    const [epwData, setEpwData] = useState<Record<string, string[]>>({});
    const [epwMessage, setEpwMessage] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: Number(value) }));
    };

    const { A_inlet, h, t_i, t_o, A_smaller, V, K } = values;

    const handleEpwUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://jaswantlhz-archbackend.vercel.app/api/upload-epw', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setEpwUploaded(true);
                setEpwYears(data.years || []);
                setEpwData(data.year_month_data || {});
                setSelectedDate(prev => ({ ...prev, year: data.years[0] || 2024 }));
                setEpwMessage(`EPW file uploaded! ${data.total_records} records found.`);
            } else {
                setEpwMessage(data.message || 'Failed to upload EPW file');
            }
        } catch (error) {
            console.error('Error uploading EPW file:', error);
            setEpwMessage('Error uploading EPW file. Please ensure the API is running.');
        }
    };

    const handleFetchEpwData = async () => {
        try {
            const response = await fetch('https://jaswantlhz-archbackend.vercel.app/api/query-epw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedDate),
            });

            const data = await response.json();

            if (data.success) {
                setValues(prev => ({
                    ...prev,
                    t_o: data.temperature,
                    V: data.wind_speed_mh
                }));
                setEpwMessage(data.message);
            } else {
                setEpwMessage(data.message || 'No data found for selected date/time');
            }
        } catch (error) {
            console.error('Error querying EPW data:', error);
            setEpwMessage('Error fetching EPW data');
        }
    };

    const formatHour = (h: number) => {
        if (h === 24) return "12 AM (Midnight)";
        if (h === 12) return "12 PM (Noon)";
        if (h > 12) return `${h - 12} PM`;
        return `${h} AM`;
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://jaswantlhz-archbackend.vercel.app/api/volume-air-forces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    A_inlet: A_inlet,
                    h: h,
                    t_i: t_i,
                    t_o: t_o,
                    A_smaller: A_smaller,
                    V: V,
                    K: K
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
                <FieldGroup className="grid">
                    
                    <FieldGroup className="mt-5 grid grid-cols-2">
                        <Field>
                        <FieldLabel htmlFor="A_inlet" className="font-source text-slate-700">
                            Free area of inlet opening (A) [m²]
                        </FieldLabel>
                        <Input id='A_inlet' name="A_inlet" type="number" onChange={handleChange} className=" bg-slate-50" />
                    </Field>
                        <Field>
                            <FieldLabel htmlFor="h" className="font-source text-slate-700">
                                Vertical distance between inlet and outlet (h) [m]
                            </FieldLabel>
                            <Input id='h' name="h" type="number" onChange={handleChange} className=" bg-slate-50" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="t_i" className="font-source text-slate-700">
                                Indoor temperature at height h (t<sub>i</sub>) [°C]
                            </FieldLabel>
                            <Input id='t_i' name="t_i" type="number" onChange={handleChange} className=" bg-slate-50" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="A_smaller" className="font-source text-slate-700">
                                Smaller opening area (A<sub>smaller</sub>) [m²]
                            </FieldLabel>
                            <Input id='A_smaller' name="A_smaller" type="number" onChange={handleChange} className=" bg-slate-50"/>
                        </Field>
                    </FieldGroup>
                    <Separator orientation="horizontal" className="mt-5 mb-5" />
                </FieldGroup>

                <FieldGroup className="grid">
                    <div className="flex">
                        <LucideFileText className="mr-2 size-7" />
                        <code className="font-sans text-2xl font-semibold">Auto-fill from Weather Data (EPW)</code>
                    </div>
                    <Card className="bg-slate-50">
                        <CardContent>
                            <Field>
                                <FieldLabel>
                                    <LucideUpload className="size-5 ml-1" />upload .epw file
                                </FieldLabel>
                                <Input
                                    id="EPW"
                                    type="file"
                                    className="bg-white"
                                    accept=".epw"
                                    onChange={handleEpwUpload}
                                />
                                <FieldDescription className="ml-1">Limit 200MB per file • EPW</FieldDescription>
                            </Field>

                            {epwUploaded && (
                                <div className="mt-4 space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                            📅 Available Data in File
                                        </h4>
                                        <div className="text-sm text-blue-900 space-y-1 max-h-40 overflow-y-auto">
                                            {epwYears.map(year => (
                                                <div key={year}>
                                                    <span className="font-bold">{year}:</span> {epwData[year]?.join(', ') || 'Partial data'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-slate-700">Select Date & Time</h4>
                                        <div className="grid grid-cols-4 gap-3">
                                            <Field>
                                                <Label className="text-xs font-medium text-slate-500 mb-1 block">Day</Label>
                                                <select
                                                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                                    value={selectedDate.day}
                                                    onChange={(e) => setSelectedDate(prev => ({ ...prev, day: Number(e.target.value) }))}
                                                >
                                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                            <Field>
                                                <Label className="text-xs font-medium text-slate-500 mb-1 block">Month</Label>
                                                <select
                                                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                                    value={selectedDate.month}
                                                    onChange={(e) => setSelectedDate(prev => ({ ...prev, month: Number(e.target.value) }))}
                                                >
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                            <Field>
                                                <Label className="text-xs font-medium text-slate-500 mb-1 block">Year</Label>
                                                <select
                                                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                                    value={selectedDate.year}
                                                    onChange={(e) => setSelectedDate(prev => ({ ...prev, year: Number(e.target.value) }))}
                                                >
                                                    {epwYears.map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                            <Field>
                                                <Label className="text-xs font-medium text-slate-500 mb-1 block">Hour</Label>
                                                <select
                                                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                                    value={selectedDate.hour}
                                                    onChange={(e) => setSelectedDate(prev => ({ ...prev, hour: Number(e.target.value) }))}
                                                >
                                                    {Array.from({ length: 24 }, (_, i) => i + 1).map(h => (
                                                        <option key={h} value={h}>{formatHour(h)}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full mt-2 bg-slate-200 hover:bg-slate-300 text-slate-800"
                                        onClick={handleFetchEpwData}
                                    >
                                        Fetch Weather Data
                                    </Button>

                                    {epwMessage && !epwMessage.includes('uploaded') && (
                                        <div className={`p-3 rounded-md text-sm ${epwMessage.includes('No data') || epwMessage.includes('Error') ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                                            {epwMessage}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Field>
                        <FieldLabel htmlFor="V" className="font-source text-slate-700">
                            Outdoor wind speed (V) [m/h]
                        </FieldLabel>
                        <Input id='V' name="V" type="number" value={V} onChange={handleChange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="t_o" className="font-source text-slate-700">
                            Outdoor temperature (t<sub>o</sub>) [°C]
                        </FieldLabel>
                        <Input id='t_o' name="t_o" type="number" value={t_o} onChange={handleChange} className=" bg-slate-50"/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="K" className="font-source text-slate-700">
                            Effectiveness coefficient (K)
                        </FieldLabel>
                        <Input id='K' name="K" type="number" value={K} onChange={handleChange} className=" bg-slate-50"/>
                    </Field>
                </FieldGroup>

                <Button
                    variant={"destructive"}
                    className="mt-5 w-30 border-slate-300"
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
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Thermal Flow (Q<sub>t</sub>)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Qt} m³/min</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Wind Flow (Q<sub>w</sub>)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Qw} m³/min</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Combined Flow (Q)</p>
                                    <p className="text-2xl font-bold text-slate-900">{result.Q_combined} m³/min</p>
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
                <BlockMath
                    math={`
\\begin{align*}
Q_t &= 7.0 \\times A \\times \\sqrt{h \\times (t_i - t_o)} \\quad [m^3/min] \\\\[10pt]
Q_t &= 7.0 \\times ${A_inlet} \\times \\sqrt{${h} \\times (${t_i} - ${t_o})} \\\\[10pt]
Q_t &= \\textbf{${result ? result.Qt.toFixed(2) : '---'}} \\text{ m³/min} \\\\[15pt]
Q_w &= \\frac{K \\times A_{smaller} \\times V}{60} \\quad [m^3/min] \\\\[10pt]
Q_w &= \\frac{${K} \\times ${A_smaller} \\times ${V}}{60} \\\\[10pt]
Q_w &= \\textbf{${result ? result.Qw.toFixed(2) : '---'}} \\text{ m³/min} \\\\[15pt]
Q_{combined} &= \\sqrt{Q_w^2 + Q_t^2} \\\\[10pt]
Q_{combined} &= \\textbf{${result ? result.Q_combined.toFixed(2) : '---'}} \\text{ m³/min}
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