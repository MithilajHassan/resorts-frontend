import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

export interface Location {
    lat: number;
    lng: number;
}

interface MapComponentProps {
    location?: Location | null;
    resortName: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ location,resortName }) => {

    return (
        <MapContainer
            center={[location!.lat, location!.lng]}
            zoom={8}
            maxZoom={20}
            style={{ height: '500px', width: '1000px', overflow: 'hidden' }}
            scrollWheelZoom={true}
            fadeAnimation={true}
            markerZoomAnimation={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
                <Marker position={[location!.lat, location!.lng]}>
                    <Popup>{resortName}</Popup>
                </Marker>

        </MapContainer>
    );
};

export default MapComponent;
