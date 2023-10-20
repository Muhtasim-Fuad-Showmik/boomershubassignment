import { useState } from "react";
import Map, { Marker, Popup, ViewState } from "react-map-gl";
import GeocodingClient, {
  GeocodeResponse,
} from "@mapbox/mapbox-sdk/services/geocoding";

import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "./pin";
import { MapiResponse } from "@mapbox/mapbox-sdk/lib/classes/mapi-response";

interface Props {
  address: string | undefined;
  loaded: boolean;
}

export default function mapComponent(props: Props) {
  const [geoData, setGeoData] = useState<Array<number | null>>([null, null]);
  const mapboxAccessToken = process.env
    .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
  const geocodingClient = GeocodingClient({
    accessToken: mapboxAccessToken,
  });
  if (props.address) {
    geocodingClient
      .forwardGeocode({
        query: props.address,
        limit: 1,
      })
      .send()
      .then((response: MapiResponse<GeocodeResponse>) => {
        const match = response.body.features[0];
        setGeoData(match.center);
      });
  }

  return (
    <div className="text-black relative w-full h-full rounded-lg overflow-hidden">
      {props.loaded && geoData[0] && geoData[1] ? (
        <Map
          mapboxAccessToken={mapboxAccessToken}
          initialViewState={{
            longitude: geoData[0],
            latitude: geoData[1],
            zoom: 14,
          }}
          style={{ width: 600, height: 730, borderRadius: 10 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <Marker longitude={geoData[0]} latitude={geoData[1]} anchor="bottom">
            <Pin />
          </Marker>
        </Map>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
