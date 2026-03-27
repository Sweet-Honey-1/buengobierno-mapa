import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { type Ubigeo, provinciasPeru } from "../../data/ubigeo";


export const ReportForm = () => {
  const [nombre, setNombre] = useState<string>('');
  const [dolencia, setDolencia] = useState<string>('');
  
  const [busqueda, setBusqueda] = useState<string>('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Ubigeo[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Ubigeo | null>(null);

  // 1. NUEVO ESTADO: Controla el mensaje de error del Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. EFECTO: Oculta el Toast automáticamente después de 3 segundos
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleBusquedaProvincia = (e: ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;
    setBusqueda(texto);
    setProvinciaSeleccionada(null); 

    if (texto.trim().length > 1) {
      const filtrados = provinciasPeru.filter(item => 
        item.provincia.toLowerCase().includes(texto.toLowerCase())
      );
      setResultadosBusqueda(filtrados);
    } else {
      setResultadosBusqueda([]);
    }
  };

  const seleccionarProvincia = (item: Ubigeo) => {
    setProvinciaSeleccionada(item);
    setBusqueda(item.provincia); 
    setResultadosBusqueda([]); 
    setToastMessage(null); // Limpia el error si selecciona algo válido
  };

  const formatearUbicacion = (provincia: string, region: string): string => {
    const cleanStr = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const provFormat = cleanStr(provincia).toUpperCase().replace(/\s+/g, '');
    const regFormat = cleanStr(region).toUpperCase().replace(/\s+/g, '');
    return `${provFormat}-${regFormat}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!provinciaSeleccionada) {
      // 3. ACTIVAMOS EL TOAST EN LUGAR DEL ALERT()
      setToastMessage("Por favor, selecciona una provincia de la lista sugerida.");
      return;
    }

    const ubicacionCanonica = formatearUbicacion(
      provinciaSeleccionada.provincia, 
      provinciaSeleccionada.region
    );

    const payload = {
      nombre,
      ubicacion_canonica: ubicacionCanonica,
      dolencia,
      estado: 'pending',
      origen: 'web'
    };

    console.log("Datos listos para Supabase:", payload);
    // Aquí tu llamada a la API
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-100 relative">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Registrar dolencia ciudadana</h2>
        <p className="text-gray-500 mb-6 text-sm">El formulario se guarda en Supabase. Luego FastAPI lo procesa y actualiza el dashboard.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              required
              value={nombre}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Tu nombre"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <input 
              type="text" 
              required
              value={busqueda}
              onChange={handleBusquedaProvincia}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors ${
                toastMessage && !provinciaSeleccionada ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej. Arequipa, Trujillo..."
              autoComplete="off"
            />
            
            {resultadosBusqueda.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {resultadosBusqueda.map((item, index) => (
                  <li 
                    key={index}
                    onClick={() => seleccionarProvincia(item)}
                    className="px-4 py-2 hover:bg-red-50 cursor-pointer text-sm text-gray-700"
                  >
                    <span className="font-semibold">{item.provincia}</span> 
                    <span className="text-gray-400 ml-2">({item.region})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dolencia</label>
          <textarea 
            required
            value={dolencia}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDolencia(e.target.value)}
            className="w-full border border-red-200 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            placeholder="Describe el problema en tu zona"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">
            Ubicación canónica: <span className="font-semibold text-red-600">
              {provinciaSeleccionada 
                ? formatearUbicacion(provinciaSeleccionada.provincia, provinciaSeleccionada.region) 
                : 'Pendiente de selección'}
            </span>
          </span>
          <button 
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Enviar reporte
          </button>
        </div>
      </form>

      {/* 4. COMPONENTE TOAST PERSONALIZADO */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 bg-white border-l-4 border-red-500 shadow-xl rounded-lg px-4 py-3 min-w-75">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-gray-800">Error de validación</p>
              <p className="text-sm text-gray-600">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}