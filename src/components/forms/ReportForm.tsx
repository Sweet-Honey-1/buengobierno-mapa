// src/components/forms/ReportForm.tsx
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { type Ubigeo, provinciasPeru } from '../../data/ubigeo';
import { submitReport } from '../../lib/api'; 

export const ReportForm = () => {
  // Estados del formulario
  const [nombre, setNombre] = useState<string>('');
  const [dolencia, setDolencia] = useState<string>('');
  
  // Estados del autocompletado
  const [busqueda, setBusqueda] = useState<string>('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Ubigeo[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Ubigeo | null>(null);
  
  // Estados de control y UI
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  
  // NUEVO: Inicialización perezosa (lazy) comprobando el localStorage
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // Si estamos en el navegador y ya completó el reporte, inicializamos en false
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mapeoSocial_reporte_completado') !== 'true';
    }
    return true;
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Si el usuario ya envió el reporte, el componente deja de renderizarse
  if (!isVisible) return null;

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
    if (toast?.type === 'error') setToast(null);
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
      setToast({ message: "Por favor, selecciona una provincia de la lista sugerida.", type: 'error' });
      return;
    }

    setIsSubmitting(true);
    const ubicacionCanonica = formatearUbicacion(provinciaSeleccionada.provincia, provinciaSeleccionada.region);

    try {
      await submitReport({
        nombre,
        ubicacion: ubicacionCanonica,
        dolencia
      });
      
      setToast({ message: "¡Reporte ciudadano registrado correctamente!", type: 'success' });
      
      // NUEVO: Guardamos en LocalStorage para futuras visitas
      localStorage.setItem('mapeoSocial_reporte_completado', 'true');
      
      // Esperamos 1.5s para que vea el éxito antes de quitar el modal
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
      
    } catch (err) {
      console.error("Error al enviar:", err);
      setToast({ message: "Error al enviar el reporte. Inténtalo de nuevo.", type: 'error' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-md overflow-y-auto">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-red-100 p-8 relative animate-in zoom-in-95 duration-300"
      >
        <h2 className="text-3xl font-black text-red-700 mb-2 tracking-tighter uppercase">Mapeo Social del Perú</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Para acceder a los datos en tiempo real, necesitamos tu participación. 
          Tu dolencia nos ayuda a entender la realidad de tu zona de manera eficaz. 
          Puedes participar de manera anónima.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Nombre o Alias</label>
            <input 
              type="text" required value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium"
              placeholder="Ej. Anónimo"
              disabled={isSubmitting}
            />
          </div>

          {/* Provincia */}
          <div className="relative">
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Provincia</label>
            <input 
              type="text" required value={busqueda}
              onChange={handleBusquedaProvincia}
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium transition-colors ${
                toast?.type === 'error' && !provinciaSeleccionada ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Busca tu provincia..."
              autoComplete="off"
              disabled={isSubmitting}
            />
            {resultadosBusqueda.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                {resultadosBusqueda.map((item, index) => (
                  <li 
                    key={index}
                    onClick={() => seleccionarProvincia(item)}
                    className="px-4 py-3 hover:bg-red-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-none"
                  >
                    <span className="font-bold text-gray-900">{item.provincia}</span> 
                    <span className="text-gray-400 ml-2">({item.region})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Dolencia */}
        <div className="mb-6">
          <label className="block text-xs font-black text-gray-400 uppercase mb-1">Tu dolencia ciudadana</label>
          <textarea 
            required value={dolencia}
            onChange={(e) => setDolencia(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none font-medium"
            placeholder="Cuentanos tu dolencia como peruano"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase">Ubicación a registrar</span>
            <span className="text-sm font-bold text-red-600">
              {provinciaSeleccionada 
                ? formatearUbicacion(provinciaSeleccionada.provincia, provinciaSeleccionada.region) 
                : 'Selecciona una provincia'}
            </span>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-black py-4 px-10 rounded-xl transition-all shadow-lg shadow-red-200 uppercase text-sm tracking-widest"
          >
            {isSubmitting ? 'Enviando...' : 'Acceder al Dashboard'}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[10000] animate-in slide-in-from-right-5 fade-in">
          <div className={`flex items-center gap-3 bg-white shadow-2xl rounded-2xl px-6 py-4 border-l-4 ${
            toast.type === 'error' ? 'border-red-500' : 'border-green-500'
          }`}>
            <p className="text-sm font-bold text-gray-800">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};