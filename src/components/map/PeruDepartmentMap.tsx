// src/components/map/PeruDepartmentMap.tsx
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card } from '../ui/Card'; 
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
  
  // Añadimos el ignore de ESLint para asegurar que Vercel no bloquee el deploy
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const maxScore = useMemo(() => {
    const scores = Object.values(departments).map((d) => d?.totalScore ?? 0).filter(Boolean);
    return Math.max(1, ...scores);
  }, [departments]);

  const getFillColor = useCallback((code: DepartmentCode | null) => {
    if (!code || !departments[code] || departments[code].totalScore === 0) return '#ffffff';
    const intensity = ((departments[code]?.totalScore ?? 0) / maxScore) * 100;
    if (intensity > 66) return '#ef4444';
    if (intensity > 33) return '#f59e0b';
    if (intensity > 0) return '#fef08a';
    return '#ffffff';
  }, [departments, maxScore]);

  const styleFeature = useCallback((feature: any) => {
    const rawName = feature.properties.NOMBDEP || feature.properties.FIRST_NOMB || feature.properties.DEPARTAMEN;
    const code = toReadableDepartmentCode(rawName);
    const isSelected = code === selectedDepartment;

    return {
      color: "#94a3b8",
      weight: 1, 
      fillColor: getFillColor(code),
      fillOpacity: isSelected ? 0.9 : 0.7,
      className: "transition-all duration-300"
    };
  }, [selectedDepartment, getFillColor]);

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
        setError("Error cargando librerías de mapa.");
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
      mapInstance.current = L.map(mapRef.current, { 
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true
      }).setView([-9.19, -75.01], 5);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);
    }

    try {
      const response = await fetch('https://raw.githubusercontent.com/juaneladio/peru-geojson/master/peru_departamental_simple.geojson');
      if (!response.ok) throw new Error("GeoJSON not found");
      const data = await response.json();

      geoJsonLayerRef.current = L.geoJSON(data, {
        style: styleFeature,
        onEachFeature: (feature: any, layer: any) => {
          layer.on({
            mouseover: () => {
              layer.setStyle({ fillOpacity: 1 });
            },
            mouseout: (e: any) => {
              if (geoJsonLayerRef.current) {
                geoJsonLayerRef.current.resetStyle(e.target);
                e.target.setStyle(styleFeature(feature));
              }
            },
            click: (e: any) => {
              const code = toReadableDepartmentCode(feature.properties.NOMBDEP || feature.properties.FIRST_NOMB);
              if (code) {
                onSelectDepartment(code);
                mapInstance.current.fitBounds(e.target.getBounds(), { padding: [50, 50], maxZoom: 7 });
              }
              L.DomEvent.stopPropagation(e);
            }
          });
        }
      }).addTo(mapInstance.current);

      mapInstance.current.fitBounds(geoJsonLayerRef.current.getBounds());
    } catch (err) {
      setError("No se pudo cargar la geografía del Perú.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle(styleFeature);
    }
  }, [selectedDepartment, departments, maxScore, styleFeature]);

  return (
    <Card className="relative overflow-hidden p-0 w-full min-h-125 flex flex-col border-none shadow-none bg-transparent">
      {/* Información Flotante */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-neutral-100 pointer-events-none">
        <h2 className="text-xl font-black text-red-700 uppercase tracking-tighter">Mapa del Perú</h2>
        <p className="mt-1 text-[10px] text-neutral-500 max-w-40 leading-tight">Usa dos dedos para mover el mapa.</p>
        
        <div className="mt-4 flex flex-col gap-1.5 text-[10px] text-neutral-600 font-bold">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ef4444] rounded-sm"></div> ALTO</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f59e0b] rounded-sm"></div> MEDIO</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#fef08a] rounded-sm"></div> BAJO</div>
        </div>
      </div>

      {/* NOTIFICACIÓN DE ERROR (Uso explícito para pasar el linter) */}
      {error !== null && (
        <div className="absolute top-4 right-4 z-[1001] animate-in fade-in slide-in-from-top-2">
          <div className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            {String(error)}
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/50 z-[1001] flex items-center justify-center backdrop-blur-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}

      <div 
        ref={mapRef} 
        className="w-full flex-1 z-10 bg-transparent touch-pan-y" 
        style={{ touchAction: 'none' }} 
      />
    </Card>
  );
}