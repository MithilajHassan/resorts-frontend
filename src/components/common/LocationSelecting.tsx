import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import "leaflet/dist/leaflet.css"

export interface Location {
    lat: number;
    lng: number;
}

interface LocationSelectorProps {
    onLocationSelect: (location: Location) => void;
}

interface MapSelectorProps {
    location?: Location | null;
    onLocationSelect: (location: Location) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onLocationSelect({ lat, lng });
        },
    });
    return null;
};

const MapSelector: React.FC<MapSelectorProps> = ({ location, onLocationSelect }) => {

    const defaultLocation: LatLngExpression = [10.8505, 76.2711];

    return (
        <MapContainer
            center={location ? [location.lat, location.lng] : defaultLocation}
            zoom={8}
            maxZoom={19}
            style={{ height: '520px', width: '1000px', overflow: 'hidden' }}
            scrollWheelZoom={true}
            fadeAnimation={true}
            markerZoomAnimation={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location && (
                <Marker position={[location.lat, location.lng]}>
                    <Popup >Selected Location</Popup>
                </Marker>
            )}
            <LocationSelector onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
};

export default MapSelector;
