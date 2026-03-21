// src/components/PeruDepartmentMap.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import type { DepartmentCode, DepartmentDashboard } from '../../types/domain';
import { toReadableDepartmentCode } from '../../lib/api';


export function PeruDepartmentMap({
  departments,
  selectedDepartment,
  onSelectDepartment,
}: {
  departments: Partial<Record<DepartmentCode, DepartmentDashboard>>
  selectedDepartment: DepartmentCode | null
  onSelectDepartment: (code: DepartmentCode) => void
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calcular el maxScore para el heatmap
  const maxScore = useMemo(() => {
    const scores = Object.values(departments).map((d) => d?.totalScore ?? 0).filter(Boolean);
    return Math.max(1, ...scores);
  }, [departments]);

  // Escala de colores estricta: Blanco -> Amarillo -> Rojo
  const getFillColor = (code: DepartmentCode | null, isSelected: boolean) => {
    if (isSelected) return '#991b1b'; // Rojo oscuro para el seleccionado
    if (!code || !departments[code] || departments[code].totalScore === 0) return '#ffffff'; // Blanco (0 reportes)
    
    const intensity = ((departments[code]?.totalScore ?? 0) / maxScore) * 100;
    
    if (intensity > 66) return '#ef4444'; // Rojo (Foco principal)
    if (intensity > 33) return '#f59e0b'; // Naranja/Amarillo oscuro (Nivel medio)
    if (intensity > 0) return '#fef08a'; // Amarillo claro (Nivel bajo)
    
    return '#ffffff';
  };

  // Estilo dinámico para el GeoJSON con borde negro
  const styleFeature = (feature: any) => {
    const rawName = feature.properties.NOMBDEP || feature.properties.FIRST_NOMB || feature.properties.DEPARTAMEN;
    const code = toReadableDepartmentCode(rawName);
    const isSelected = code === selectedDepartment;

    return {
      color: "#000000", // Borde negro para delimitar el mapa
      weight: isSelected ? 2.5 : 1, // Borde más grueso si está seleccionado
      fillColor: getFillColor(code, isSelected),
      fillOpacity: isSelected ? 0.9 : 0.8, // Opacidad un poco más alta para que destaquen los colores
      className: "transition-all duration-300"
    };
  };

  // Cargar Leaflet dinámicamente
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!document.getElementById('leaflet-js')) {
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }
        
        initMap();
      } catch (err) {
        setError("Error al cargar la librería del mapa.");
        setLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const initMap = async () => {
    const L = (window as any).L;
    if (!mapRef.current || !L) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([-9.19, -75.01], 5);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstance.current);
    }

    const map = mapInstance.current;

    try {
      const response = await fetch('https://raw.githubusercontent.com/juaneladio/peru-geojson/master/peru_departamental_simple.geojson');
      if (!response.ok) throw new Error("Error en la descarga del mapa");
      const data = await response.json();

      geoJsonLayerRef.current = L.geoJSON(data, {
        style: styleFeature,
        onEachFeature: (feature: any, layer: any) => {
          layer.on({
            mouseover: (e: any) => {
              const currentCode = toReadableDepartmentCode(feature.properties.NOMBDEP || feature.properties.FIRST_NOMB || feature.properties.DEPARTAMEN);
              if (currentCode !== selectedDepartment) {
                layer.setStyle({ weight: 2, fillOpacity: 1 });
                console.log(e)
              }
              layer.bringToFront();
            },
            mouseout: (e: any) => {
              if (geoJsonLayerRef.current) {
                geoJsonLayerRef.current.resetStyle(e.target);
              }
            },
            click: (e: any) => {
              const code = toReadableDepartmentCode(feature.properties.NOMBDEP || feature.properties.FIRST_NOMB || feature.properties.DEPARTAMEN);
              if (code) {
                onSelectDepartment(code);
                map.fitBounds(e.target.getBounds(), { padding: [50, 50], maxZoom: 7 });
              }
            }
          });
        }
      }).addTo(map);

      map.fitBounds(geoJsonLayerRef.current.getBounds());
    } catch (err) {
      console.error("Error cargando el GeoJSON:", err);
      setError("No se pudo cargar el mapa geográfico. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle(styleFeature);
    }
  }, [departments, selectedDepartment, maxScore]);

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-sm border border-neutral-200 bg-blue-50/30">
      <div className="absolute top-4 left-4 z-400 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-neutral-100">
        <h2 className="text-xl font-black text-red-700">Mapa del Perú</h2>
        <p className="mt-1 text-xs text-neutral-500 max-w-50">Haz clic en un departamento para ver el detalle territorial.</p>
        
        {/* Leyenda de colores */}
        <div className="mt-4 flex flex-col gap-1 text-[10px] text-neutral-600 font-medium">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ef4444] border border-black"></div> Alto</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f59e0b] border border-black"></div> Medio</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#fef08a] border border-black"></div> Bajo</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ffffff] border border-black"></div> Sin datos</div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/80 z-500 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-red-800 font-medium">Cargando fronteras departamentales...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-white/90 z-500 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-red-600 font-bold mb-2 text-xl">Error</p>
          <p className="text-neutral-600">{error}</p>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full z-10" />
    </div>
  );
}