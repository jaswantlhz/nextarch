// Server Component — dynamic prevents static prerendering
export const dynamic = "force-dynamic";

import CalculatorClient from "./calculator-client";

export default function CalculatorPage() {
    return <CalculatorClient />;
}