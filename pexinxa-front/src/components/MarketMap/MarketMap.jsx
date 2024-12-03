import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -21.6034,
  lng: -48.3665,
};

const MarketMap = () => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null); 
  const [promotions, setPromotions] = useState({}); 

  useEffect(() => {
    const fetchNearbyMarkets = () => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      const request = {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: "2000",
        type: ["supermarket"],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setMarkets(results);
          // Simulando promoções para cada mercado
          const promoData = results.reduce((acc, market) => {
            acc[market.place_id] = `Promoção de 10% em ${market.name}!`; 
            return acc;
          }, {});
          setPromotions(promoData);
        }
      });
    };

    if (window.google) {
      fetchNearbyMarkets();
    }
  }, []);

  const handleMarkerClick = (market) => {
    setSelectedMarket(market);
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_API_KEY" libraries={["places"]}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {markets.map((market) => (
          <Marker
            key={market.place_id}
            position={{
              lat: market.geometry.location.lat(),
              lng: market.geometry.location.lng(),
            }}
            title={market.name}
            onClick={() => handleMarkerClick(market)}
          />
        ))}

        {selectedMarket && (
          <InfoWindow
            position={{
              lat: selectedMarket.geometry.location.lat(),
              lng: selectedMarket.geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedMarket(null)}
          >
            <div>
              <h3>{selectedMarket.name}</h3>
              <p>{promotions[selectedMarket.place_id]}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MarketMap;
