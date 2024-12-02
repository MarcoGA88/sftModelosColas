import React, { useState } from "react";
import { Calculator } from "lucide-react";

const PICMCalculator = () => {
  const [inputs, setInputs] = useState({
    lambda: "",
    mu: "",
    k: "",
    n: "",
    laborHours: "8",
    CTE: "",
    CTS: "",
    CTSE: "",
    CS: "",
  });

  const [results, setResults] = useState({
    P0: "",
    Pk: "",
    PNE: "",
    Pn: "",
    L: "",
    Lq: "",
    Ln: "",
    W: "",
    Wq: "",
    CTE: "",
    CTS: "",
    CTSE: "",
    CS: "",
    CT: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateResults = () => {
    const lamb = parseFloat(inputs.lambda);
    const mu = parseFloat(inputs.mu);
    const k = parseInt(inputs.k, 10) || 1;
    const n = parseInt(inputs.n, 10) || 0;
    const laborHours = parseFloat(inputs.laborHours);

    if (lamb <= 0 || mu <= 0 || k < 1 || laborHours <= 0 || laborHours > 24) {
      alert("Por favor, ingrese valores válidos.");
      return;
    }

    const rho = lamb / (k * mu); // Factor de utilización por servidor
    if (rho >= 1) {
      alert("El sistema es inestable porque λ / (kμ) ≥ 1. Ajuste los parámetros.");
      return;
    }

    const factorial = (num) => (num <= 1 ? 1 : num * factorial(num - 1));

    // Cálculo de P0
    const P0 = (() => {
      let sum = 0;
      for (let i = 0; i < k; i++) {
        sum += (1 / factorial(i)) * (lamb / mu) ** i;
      }
      const termK = (1 / factorial(k)) * (lamb / mu) ** k * (1 / (1 - rho));
      return 1 / (sum + termK);
    })();

    const Pk =
      (1 / factorial(k)) * (lamb / mu) ** k * (1 / (1 - rho)) * P0; // Probabilidad de que todos los servidores estén ocupados
    const PNE = 1 - Pk; // Probabilidad de que no todos los servidores estén ocupados
    const Pn =
      n <= k
        ? (1 / factorial(n)) * (lamb / mu) ** n * P0
        : (1 / (factorial(k) * k ** (n - k))) * (lamb / mu) ** n * P0; // Probabilidad de exactamente n clientes en el sistema

    const Lq =
      (P0 * (lamb / mu) ** k * rho) /
      (factorial(k) * (1 - rho) ** 2); // Número promedio de clientes en la cola
    const L = Lq + lamb / mu; // Número promedio de clientes en el sistema
    const Wq = Lq / lamb; // Tiempo promedio en la cola
    const W = Wq + 1 / mu; // Tiempo promedio en el sistema
    const Ln=Lq/Pk
    // Cálculo de costos
    const CTE = parseFloat(inputs.CTE || 0) * lamb * laborHours * Wq;
    const CTS = parseFloat(inputs.CTS || 0) * lamb * laborHours * W;
    const CTSE = parseFloat(inputs.CTSE || 0) * lamb * laborHours * (1 / mu);
    const CS = parseFloat(inputs.CS || 0) * k;
    const CT = CTE + CTS + CTSE + CS;

    setResults({
      P0: P0.toFixed(4),
      Pk: Pk.toFixed(4),
      PNE: PNE.toFixed(4),
      Pn: Pn.toFixed(4),
      L: L.toFixed(4),
      Lq: Lq.toFixed(4),
      Ln: Ln.toFixed(4),
      W: W.toFixed(4),
      Wq: Wq.toFixed(4),
      CTE: `$${CTE.toFixed(2)}/día`,
      CTS: `$${CTS.toFixed(2)}/día`,
      CTSE: `$${CTSE.toFixed(2)}/día`,
      CS: `$${CS.toFixed(2)}/día`,
      CT: `$${CT.toFixed(2)}/día`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl p-10 border border-blue-100">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10 flex justify-center items-center gap-3">
          <Calculator className="w-10 h-10 text-blue-600" /> Calculadora PICM (M/M/k)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Sección de Parámetros */}
          <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-3">
              Parámetros del Sistema
            </h2>
            <div className="space-y-4">
              {[
                { name: "lambda", label: "Tasa de llegada (λ c/h)" },
                { name: "mu", label: "Tasa de servicio (μ c/h)" },
                { name: "k", label: "Número de servidores (k)" },
                { name: "n", label: "Número de clientes (n)" },
                { name: "laborHours", label: "Horas laborales (H)" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    name={name}
                    value={inputs[name]}
                    onChange={handleInputChange}
                    placeholder="Ingrese valor"
                    className="w-full p-3 bg-white border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-3 mt-6">
              Costos
            </h2>
            <div className="space-y-4">
              {["CTE", "CTS", "CTSE", "CS"].map((cost) => (
                <div key={cost}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    {`Costo ${cost} ($/h):`}
                  </label>
                  <input
                    type="number"
                    name={cost}
                    value={inputs[cost]}
                    onChange={handleInputChange}
                    placeholder="Ingrese valor"
                    className="w-full p-3 bg-white border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={calculateResults}
                className="px-10 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
              >
                Calcular Métricas
              </button>
            </div>
          </div>

          {/* Sección de Resultados */}
          <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-3">
              Resultados
            </h2>
            {[
              { title: "Probabilidades", data: { P0: results.P0, Pk: results.Pk, PNE: results.PNE, Pn: results.Pn } },
              { title: "Clientes", data: { L: results.L, Lq: results.Lq ,Ln: results.Ln } },
              { title: "Tiempos", data: { W: results.W, Wq: results.Wq } },
              { title: "Costos", data: { CTE: results.CTE, CTS: results.CTS, CTSE: results.CTSE, CS: results.CS, CT: results.CT } },
            ].map(({ title, data }) => (
              <div key={title}>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">{title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm text-blue-800 border border-blue-100"
                    >
                      <span className="font-semibold">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PICMCalculator;
