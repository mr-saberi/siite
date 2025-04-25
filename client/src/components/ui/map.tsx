import { useEffect, useRef } from "react";
import L from "leaflet";

interface MapComponentProps {
  position: [number, number]; // [latitude, longitude]
  zoom: number;
  popupText?: string;
}

const MapComponent = ({ position, zoom, popupText }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const mapInstance = L.map(mapRef.current).setView(position, zoom);
    
    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    
    // Add marker
    const marker = L.marker(position).addTo(mapInstance);
    
    // Add popup if text is provided
    if (popupText) {
      marker.bindPopup(popupText).openPopup();
    }
    
    mapInstanceRef.current = mapInstance;
    
    // Cleanup on unmount
    return () => {
      mapInstance.remove();
      mapInstanceRef.current = null;
    };
  }, [position, zoom, popupText]);

  // Handle position changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    mapInstanceRef.current.setView(position, zoom);
    
    // Update marker position
    const markers = document.querySelectorAll('.leaflet-marker-icon');
    if (markers.length === 0) {
      const marker = L.marker(position).addTo(mapInstanceRef.current);
      if (popupText) {
        marker.bindPopup(popupText).openPopup();
      }
    }
  }, [position, zoom, popupText]);

  return (
    <div ref={mapRef} className="w-full h-full" />
  );
};

export default MapComponent;
