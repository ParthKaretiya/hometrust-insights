import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons (no bundler URL resolution at runtime)
const icon = L.icon({
  iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = icon;

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 0.6 });
  }, [lat, lng, map]);
  return null;
}

export function MapView({
  lat,
  lng,
  zoom = 13,
  radiusMeters,
  markers = [],
  height = 320,
  onMarkerClick,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  radiusMeters?: number;
  markers?: { id: string; lat: number; lng: number; label?: string }[];
  height?: number;
  onMarkerClick?: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo lat={lat} lng={lng} />
        <Marker position={[lat, lng]} />
        {radiusMeters && (
          <Circle center={[lat, lng]} radius={radiusMeters} pathOptions={{ color: "#3b82f6", fillOpacity: 0.08 }} />
        )}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            eventHandlers={onMarkerClick ? { click: () => onMarkerClick(m.id) } : undefined}
          />
        ))}
      </MapContainer>
    </div>
  );
}
