import React, { useState } from "react";
import { Calculator } from "lucide-react";

const PFCMCalculator = () => {
  const [inputs, setInputs] = useState({
    lambda: "",
    mu: "",
    k: "",
    M: "",
    n: "",
    hours: "8",
    costs: {
      CTE: "",
      CTS: "",
      CTSE: "",
      CS: "",
    },
  });

  const [results, setResults] = useState({
    probabilities: {
      P0: "",
      Pn: "",
      PE: "",
      PNE: "",
    },
    clients: {
      L: "",
      Lq: "",
      Ln: "",
    },
    times: {
      W: "",
      Wq: "",
      Wn: "",
    },
    costs: {
      CTE: "",
      CTS: "",
      CTSE: "",
      CS: "",
      CT: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      if (name in prev.costs) {
        return { ...prev, costs: { ...prev.costs, [name]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const factorial = (num) => {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
  };

  const verifyStability = (lamb, mu, k, M) => {
    return lamb / (M * mu) < 1;
  };

  const calculateP0 = (lamb, mu, k, M) => {
    // First summation (n=0 to k-1)
    const sum1 = Array.from({ length: k }, (_, n) => 
      (factorial(M) / (factorial(M - n) * factorial(n))) * Math.pow(lamb / mu, n)
    ).reduce((a, b) => a + b, 0);

    // Second summation (n=k to M)
    const sum2 = Array.from({ length: M - k + 1 }, (_, i) => {
      const n = i + k;
      return (factorial(M) / (factorial(M - n) * k * Math.pow(k, n - k))) * Math.pow(lamb / mu, n);
    }).reduce((a, b) => a + b, 0);

    return 1 / (sum1 + sum2);
  };

  const calculatePn = (n, lamb, mu, k, M, P0) => {
    if (n >= 0 && n <= k) {
      return P0 * (factorial(M) / (factorial(M - n) * factorial(n))) * Math.pow(lamb / mu, n);
    } else if (k <= n && n <= M) {
      return P0 * (factorial(M) / (factorial(M - n) * k * Math.pow(k, n - k))) * Math.pow(lamb / mu, n);
    }
    return 0;
  };

  const calculatePe = (lamb, mu, k, M, P0) => {
    return Array.from({ length: M - k + 1 }, (_, i) => {
      const n = i + k;
      return calculatePn(n, lamb, mu, k, M, P0);
    }).reduce((a, b) => a + b, 0);
  };

  const calculate = () => {
    const { lambda, mu, k, M, n, hours, costs } = inputs;

    try {
      const lamb = parseFloat(lambda);
      const muVal = parseFloat(mu);
      const kVal = parseInt(k, 10);
      const MVal = parseInt(M, 10);
      const nVal = parseInt(n, 10);
      const hoursVal = parseFloat(hours);

      // Input validation
      if (!verifyStability(lamb, muVal, kVal, MVal)) {
        alert("El sistema no es estable. La condición λ/Mμ < 1 no se cumple");
        return;
      }

      // Calculate probabilities
      const P0 = calculateP0(lamb, muVal, kVal, MVal);
      const Pn = calculatePn(nVal, lamb, muVal, kVal, MVal, P0);
      const PE = calculatePe(lamb, muVal, kVal, MVal, P0);
      const PNE = 1 - PE;

      // Validate total probability
      const totalProb = Array.from({ length: MVal + 1 }, (_, i) => 
        calculatePn(i, lamb, muVal, kVal, MVal, P0)
      ).reduce((a, b) => a + b, 0);

      if (Math.abs(totalProb - 1) > 0.01) {
        console.warn(`Total probability sum (${totalProb}) is not close to 1`);
      }

      // Calculate clients in system
      const L = Array.from({ length: MVal + 1 }, (_, i) => 
        i * calculatePn(i, lamb, muVal, kVal, MVal, P0)
      ).reduce((a, b) => a + b, 0);

      const Lq = Array.from({ length: MVal - kVal + 1 }, (_, i) => {
        const n = i + kVal;
        return (n - kVal) * calculatePn(n, lamb, muVal, kVal, MVal, P0);
      }).reduce((a, b) => a + b, 0);

      const Ln = Lq / PE;

      // Calculate times
      const Wq = Lq / ((MVal - L) * lamb);
      const W = Wq + (1 / muVal);
      const Wn = Wq / PE;

      // Calculate costs
      const CTECost = parseFloat(costs.CTE || 0) * Wq * hoursVal;
      const CTSCost = parseFloat(costs.CTS || 0) * W * hoursVal;
      const CTSECost = parseFloat(costs.CTSE || 0) * Wq * hoursVal;
      const CSCost = parseFloat(costs.CS || 0) * MVal * hoursVal;
      const totalCost = CTECost + CTSCost + CTSECost + CSCost;

      setResults({
        probabilities: {
          P0: P0.toFixed(4),
          Pn: Pn.toFixed(4),
          PE: PE.toFixed(4),
          PNE: PNE.toFixed(4),
        },
        clients: {
          L: L.toFixed(2),
          Lq: Lq.toFixed(2),
          Ln: Ln.toFixed(2),
        },
        times: {
          W: W.toFixed(2),
          Wq: Wq.toFixed(2),
          Wn: Wn.toFixed(2),
        },
        costs: {
          CTE: `$${CTECost.toFixed(2)}/día`,
          CTS: `$${CTSCost.toFixed(2)}/día`,
          CTSE: `$${CTSECost.toFixed(2)}/día`,
          CS: `$${CSCost.toFixed(2)}/día`,
          CT: `$${totalCost.toFixed(2)}/día`,
        },
      });
    } catch (error) {
      alert("Ocurrió un error al calcular los resultados.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl p-10 border border-blue-100">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10 flex justify-center items-center gap-3">
          <Calculator className="w-10 h-10 text-blue-600" /> Calculadora PFCM (M/M/k/M/M)
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Input Section */}
          <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-3">
              Parámetros del Sistema
            </h2>
            <div className="space-y-4">
              {[
                { name: "lambda", label: "Tasa de llegada (λ c/h)" },
                { name: "mu", label: "Tasa de servicio (μ c/h)" },
                { name: "k", label: "Número de servidores (k)" },
                { name: "M", label: "Población total (M)" },
                { name: "n", label: "Número de clientes (n)" },
                { name: "hours", label: "Horas laborales (H)" }
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
                    value={inputs.costs[cost]}
                    onChange={handleInputChange}
                    placeholder="Ingrese valor"
                    className="w-full p-3 bg-white border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={calculate}
                className="px-10 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
              >
                Calcular Métricas
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-3">
              Resultados
            </h2>
            {[
              { title: "Probabilidades", data: results.probabilities },
              { title: "Clientes", data: results.clients },
              { title: "Tiempos", data: results.times },
              { title: "Costos", data: results.costs }
            ].map(({ title, data }) => (
              <div key={title}>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">{title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-blue-100 pb-1">
                      <span className="text-sm text-blue-600">{key}:</span>
                      <span className="text-sm font-medium text-blue-900">
                        {value || 'Sin calcular'}
                      </span>
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

export default PFCMCalculator;