import React, { useState } from "react";
import { Calculator } from "lucide-react";

const PFCSCalculator = () => {
  const [inputs, setInputs] = useState({
    lambda: "",
    mu: "",
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
      P_ocupado: "",
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

  const calculate = () => {
    const { lambda, mu, M, n, hours, costs } = inputs;

    try {
      const lamb = parseFloat(lambda);
      const muVal = parseFloat(mu);
      const MVal = parseInt(M, 10);
      const nVal = n ? parseInt(n, 10) : 0;
      const hoursVal = parseFloat(hours);

      if (
        lamb <= 0 ||
        muVal <= 0 ||
        MVal <= 0 ||
        nVal < 0 ||
        nVal > MVal ||
        hoursVal <= 0
      ) {
        alert("Por favor verifica los valores ingresados.");
        return;
      }

      const calculateP0 = (lamb, mu, M) => {
        let suma = 0;
        for (let n = 0; n <= M; n++) {
          suma += (factorial(M) / factorial(M - n)) * Math.pow(lamb / mu, n);
        }
        return 1 / suma;
      };

      const factorial = (num) => {
        if (num <= 1) return 1;
        return num * factorial(num - 1);
      };

      const P0 = calculateP0(lamb, muVal, MVal);
      const Pn =
        nVal >= 0 && nVal <= MVal
          ? (factorial(MVal) / factorial(MVal - nVal)) *
            Math.pow(lamb / muVal, nVal) *
            P0
          : 0;
      const L = MVal - (muVal / lamb) * (1 - P0);
      const P_ocupado = 1 - P0;
      const Lq = L - (1 - P0);
      const Ln = Lq / P_ocupado;
      const W = Lq / (lamb * (MVal - L)) + 1 / muVal;
      const Wq = Lq / (lamb * (MVal - L));
      const Wn = Wq / P_ocupado;

      const CTECost = parseFloat(costs.CTE || 0) * Wq * hoursVal;
      const CTSCost = parseFloat(costs.CTS || 0) * W * hoursVal;
      const CTSECost = parseFloat(costs.CTSE || 0) * Wq * hoursVal;
      const CSCost = parseFloat(costs.CS || 0) * MVal * hoursVal;
      const totalCost = CTECost + CTSCost + CTSECost + CSCost;

      setResults({
        probabilities: {
          P0: P0.toFixed(4),
          Pn: Pn.toFixed(4),
          P_ocupado: P_ocupado.toFixed(4),
        },
        clients: {
          L: L.toFixed(4),
          Lq: Lq.toFixed(4),
          Ln: Ln.toFixed(4),
        },
        times: {
          W: W.toFixed(4),
          Wq: Wq.toFixed(4),
          Wn: Wn.toFixed(4),
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
          <Calculator className="w-10 h-10 text-blue-600" /> Calculadora PFCS (M/M/1/M/M)
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

export default PFCSCalculator;