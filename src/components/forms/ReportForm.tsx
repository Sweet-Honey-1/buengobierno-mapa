
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {type Ubigeo, provinciasPeru } from '../../data/ubigeo';
import { submitReport } from '../../lib/api'; 

export const ReportForm = () => {
  // Estados de los campos del formulario
  const [nombre, setNombre] = useState<string>('');
  const [dolencia, setDolencia] = useState<string>('');
  
  // Estados del autocompletado de provincias
  const [busqueda, setBusqueda] = useState<string>('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Ubigeo[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Ubigeo | null>(null);
  
  // Estado para bloquear el botón mientras se envía
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estados para el Toast (Notificación flotante)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Efecto para ocultar el Toast después de 4 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Manejador del buscador de provincias
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

  // Al hacer clic en una provincia de la lista
  const seleccionarProvincia = (item: Ubigeo) => {
    setProvinciaSeleccionada(item);
    setBusqueda(item.provincia); 
    setResultadosBusqueda([]); 
    if (toast?.type === 'error') setToast(null); // Quita el error si ya seleccionó algo
  };

  // Formateador exacto para tu backend: EJ: 'AREQUIPA-AREQUIPA'
  const formatearUbicacion = (provincia: string, region: string): string => {
    const cleanStr = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const provFormat = cleanStr(provincia).toUpperCase().replace(/\s+/g, '');
    const regFormat = cleanStr(region).toUpperCase().replace(/\s+/g, '');
    return `${provFormat}-${regFormat}`;
  };

  // Envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!provinciaSeleccionada) {
      setToast({ message: "Por favor, selecciona una provincia de la lista sugerida.", type: 'error' });
      return;
    }

    setIsSubmitting(true);
    const ubicacionCanonica = formatearUbicacion(provinciaSeleccionada.provincia, provinciaSeleccionada.region);

    const payload = {
      nombre,
      ubicacion: ubicacionCanonica, // Match con tu SubmissionPayload en api.ts
      dolencia
    };

    try {
      // Llamada a tu API centralizada
      await submitReport(payload);
      
      // Éxito: Mostrar notificación y limpiar el formulario
      setToast({ message: "¡Reporte ciudadano registrado correctamente!", type: 'success' });
      setNombre('');
      setDolencia('');
      setBusqueda('');
      setProvinciaSeleccionada(null);
      
    } catch (err) {
      console.error("Error al enviar a Supabase:", err);
      setToast({ message: "Ocurrió un error al enviar el reporte. Inténtalo de nuevo.", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-100 relative">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Registrar dolencia ciudadana</h2>
        <p className="text-gray-500 mb-6 text-sm">El formulario se guarda en Supabase. Luego FastAPI lo procesa y actualiza el dashboard.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              required
              value={nombre}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Tu nombre"
              disabled={isSubmitting}
            />
          </div>

          {/* Provincia (Buscador) */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <input 
              type="text" 
              required
              value={busqueda}
              onChange={handleBusquedaProvincia}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors ${
                toast?.type === 'error' && !provinciaSeleccionada ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej. Arequipa, Trujillo..."
              autoComplete="off"
              disabled={isSubmitting}
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

        {/* Dolencia */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dolencia</label>
          <textarea 
            required
            value={dolencia}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDolencia(e.target.value)}
            className="w-full border border-red-200 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            placeholder="Describe el problema en tu zona"
            disabled={isSubmitting}
          />
        </div>

        {/* Footer del Formulario */}
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
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
          </button>
        </div>
      </form>

      {/* Componente Toast Personalizado (Éxito y Error) */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 bg-white border-l-4 shadow-xl rounded-lg px-4 py-3 min-w-75 ${
            toast.type === 'error' ? 'border-red-500' : 'border-green-500'
          }`}>
            {toast.type === 'error' ? (
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            
            <div>
              <p className={`text-sm font-bold ${toast.type === 'error' ? 'text-gray-800' : 'text-green-800'}`}>
                {toast.type === 'error' ? 'Error de validación' : '¡Completado!'}
              </p>
              <p className="text-sm text-gray-600">{toast.message}</p>
            </div>
            
            <button 
              onClick={() => setToast(null)}
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