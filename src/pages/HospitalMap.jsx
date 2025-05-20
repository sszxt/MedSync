import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Icons
import {
  FaPlus,
  FaMinus,
  FaLocationArrow,
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaRoute,
  FaHospital,
  FaStar,
  FaFilter,
  FaCar,
  FaWalking,
  FaBus,
} from "react-icons/fa";

// Fix for missing default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const emergencyIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom Components
function MapControls({ mapRef }) {
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current.flyTo([latitude, longitude], 15);
        },
        () => alert("Unable to retrieve your location.")
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[1000]">
      <button
        onClick={() => mapRef.current.flyTo(mapRef.current.getCenter(), mapRef.current.getZoom() + 1)}
        title="Zoom In"
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all"
      >
        <FaPlus />
      </button>
      <button
        onClick={() => mapRef.current.flyTo(mapRef.current.getCenter(), mapRef.current.getZoom() - 1)}
        title="Zoom Out"
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all"
      >
        <FaMinus />
      </button>
      <button
        onClick={locateUser}
        title="My Location"
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all"
      >
        <FaLocationArrow />
      </button>
    </div>
  );
}

function HospitalCard({ hospital, onClick, onHover, currentPosition }) {
  const distance =
    currentPosition && hospital.lat && hospital.lon
      ? `${L.latLng(currentPosition[0], currentPosition[1])
          .distanceTo(L.latLng(hospital.lat, hospital.lon))
          .toFixed(0)} m`
      : "N/A";

  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      className="flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-500 text-white rounded-full">
        <FaHospital />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{hospital.tags?.name || "Unnamed Hospital"}</h3>
        <div className="flex items-center mt-1">
          <span className="text-xs text-blue-500 font-medium">{distance}</span>
        </div>
      </div>
    </div>
  );
}

// Main Component
const HospitalMap = () => {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [route, setRoute] = useState(null);
  const [travelMode, setTravelMode] = useState("drive");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    specialties: [],
    facilities: [],
    distance: 10,
  });
  const [highlightedHospital, setHighlightedHospital] = useState(null);

  const mapRef = useRef();
  const routingControlRef = useRef();
  const searchContainerRef = useRef();
  const inputRef = useRef();

  const provider = new OpenStreetMapProvider();

  // Sample data for filters
  const specialties = [
    "Emergency",
    "Pediatrics",
    "Cardiology",
    "Oncology",
    "Maternity",
  ];
  const facilities = [
    "Pharmacy",
    "ICU",
    "Parking",
    "Wheelchair Access",
    "24/7",
  ];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchResults([]);
        if (inputRef.current) inputRef.current.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        const query = `
          [out:json];
          (
            node["amenity"="hospital"](around:${
              selectedFilters.distance * 1000
            },${latitude},${longitude});
            way["amenity"="hospital"](around:${
              selectedFilters.distance * 1000
            },${latitude},${longitude});
            relation["amenity"="hospital"](around:${
              selectedFilters.distance * 1000
            },${latitude},${longitude});
          );
          out center;
        `;

        try {
          const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
          });
          const data = await res.json();
          setHospitals(data.elements);
        } catch (error) {
          console.error("Error fetching hospitals:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
      }
    );
  }, [selectedFilters.distance]);

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await provider.search({ query: searchQuery });
      setSearchResults(results);

      if (results.length > 0 && mapRef.current) {
        const { x, y } = results[0];
        mapRef.current.flyTo([y, x], 15);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const showDirections = (hospital) => {
    if (!position || !hospital) return;

    const lat = hospital.lat || hospital.center?.lat;
    const lon = hospital.lon || hospital.center?.lon;
    if (!lat || !lon) return;

    setSelectedHospital(hospital);

    // Remove existing routing control if any
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(position[0], position[1]), L.latLng(lat, lon)],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#0066ff", weight: 5 }],
      },
      createMarker: () => null,
      show: false,
    }).addTo(mapRef.current);

    setTimeout(() => {
      const container = document.querySelector(".custom-routing-container");
      if (container) {
        const closeButton = document.createElement("button");
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener("click", () => {
          clearDirections();
        });
        container.style.position = "relative";
        container.prepend(closeButton);
      }
    }, 100);

    routingControlRef.current = routingControl;
    setRoute(routingControl);

    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      const summary = routes[0].summary;

      const start = routingControl.getWaypoints()[0].latLng;
      const end = routingControl.getWaypoints()[1].latLng;

      const destinationHospital = hospitals.find((hospital) => {
        const hospitalLat = hospital.lat || hospital.center?.lat;
        const hospitalLng = hospital.lon || hospital.center?.lon;
        return (
          hospitalLat &&
          hospitalLng &&
          hospitalLat.toFixed(6) === end.lat.toFixed(6) &&
          hospitalLng.toFixed(6) === end.lng.toFixed(6)
        );
      });

      const hospitalName = destinationHospital?.tags?.name || "Hospital";
      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;

      const popupContent = document.createElement("div");
      popupContent.innerHTML = `
        <div class="mb-2">
          <strong>Destination:</strong> ${hospitalName}
        </div>
        <div class="mb-2">
          <strong>Distance:</strong> ${(summary.totalDistance / 1000).toFixed(2)} km
        </div>
        <div class="mb-3">
          <strong>Estimated Time:</strong> ${(summary.totalTime / 60).toFixed(1)} mins
        </div>
        <a href="${gmapsUrl}" target="_blank" class="inline-block px-4 py-2 bg-blue-500 text-white no-underline rounded font-medium">
          Open in Google Maps
        </a>
      `;

      L.popup().setLatLng(end).setContent(popupContent).openOn(mapRef.current);
    });
  };

  const clearDirections = () => {
    if (routingControlRef.current) {
      routingControlRef.current.getPlan().setWaypoints([]);
      routingControlRef.current.remove();
      routingControlRef.current = null;

      const container = document.querySelector(".custom-routing-container");
      if (container) {
        container.remove();
      }
    }
    setSelectedHospital(null);
    setRoute(null);
  };

  const highlightHospital = (hospital) => {
    setHighlightedHospital(hospital);
  };

  const openExternalDirections = (hospital) => {
    if (!position || !hospital) return;

    const originLat = position[0];
    const originLng = position[1];
    const destLat = hospital.lat ?? hospital.center?.lat;
    const destLng = hospital.lon ?? hospital.center?.lon;

    const mode =
      travelMode === "drive"
        ? "driving"
        : travelMode === "walk"
        ? "walking"
        : "transit";

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${originLat},${originLng}` +
      `&destination=${destLat},${destLng}` +
      `&travelmode=${mode}`;

    window.open(url, "_blank");
  };

  if (loading || !position) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
        <div className="relative w-16 h-16 mb-4">
          <div className="w-full h-full border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-700">🩺 Locating you and loading nearby hospitals...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full grid grid-cols-[auto_1fr] grid-rows-[70px_1fr]">
      {/* Header */}
      <header className="col-span-2 flex items-center justify-between px-6 py-4 bg-white shadow-sm z-[1000]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            Nearby Hospitals
          </h1>
        </div>
        
        <div className="relative flex-1 max-w-xl mx-6" ref={searchContainerRef}>
          <div className="relative flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                title="Clear search"
                className="absolute right-12 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            )}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search address or location..."
              className="flex-1 py-2 px-4 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FaSearch />
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto z-[1001]">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    mapRef.current.flyTo([result.y, result.x], 15);
                    setSearchResults([]);
                    setSearchQuery(result.label.split(",")[0]);
                    inputRef.current.blur();
                  }}
                >
                  <div className="mr-3 text-blue-500">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <div className="font-medium">{result.label.split(",")[0]}</div>
                    <div className="text-sm text-gray-500">
                      {result.label.split(",").slice(1).join(",")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 overflow-y-auto transition-all ${showFilters ? "w-80" : "w-72"}`}>
        {showFilters ? (
          <div className="p-4">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
              <FaFilter className="text-blue-500" />
              Filter Hospitals
            </h3>
            
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">Distance (km)</h4>
              <input
                type="range"
                min="1"
                max="50"
                value={selectedFilters.distance}
                onChange={(e) => setSelectedFilters({...selectedFilters, distance: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="mt-2 text-center text-blue-500 font-medium">
                {selectedFilters.distance} km
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedFilters.specialties.includes(specialty)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedFilters({
                        ...selectedFilters,
                        specialties: selectedFilters.specialties.includes(specialty)
                          ? selectedFilters.specialties.filter(s => s !== specialty)
                          : [...selectedFilters.specialties, specialty]
                      });
                    }}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">Facilities</h4>
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility) => (
                  <button
                    key={facility}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedFilters.facilities.includes(facility)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedFilters({
                        ...selectedFilters,
                        facilities: selectedFilters.facilities.includes(facility)
                          ? selectedFilters.facilities.filter(f => f !== facility)
                          : [...selectedFilters.facilities, facility]
                      });
                    }}
                  >
                    {facility}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Nearby Hospitals</h2>
            <div className="space-y-3">
              {hospitals.map((hospital, index) => {
                const lat = hospital.lat || hospital.center?.lat;
                const lon = hospital.lon || hospital.center?.lon;
                if (!lat || !lon) return null;

                return (
                  <HospitalCard
                    key={index}
                    hospital={hospital}
                    currentPosition={position}
                    onClick={() => showDirections(hospital)}
                    onHover={() => highlightHospital(hospital)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <MapContainer
          center={position}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Current location */}
          <Marker position={position} icon={redIcon}>
            <Popup>Your Current Location</Popup>
          </Marker>

          {/* Hospitals */}
          {hospitals.map((hospital, index) => {
            const lat = hospital.lat || hospital.center?.lat;
            const lon = hospital.lon || hospital.center?.lon;
            const name = hospital.tags?.name || "Unnamed Hospital";
            if (!lat || !lon) return null;

            const isHighlighted =
              highlightedHospital &&
              (highlightedHospital.id === hospital.id ||
                (highlightedHospital.lat === hospital.lat &&
                  highlightedHospital.lon === hospital.lon));

            return (
              <Marker
                key={index}
                position={[lat, lon]}
                icon={isHighlighted ? redIcon : blueIcon}
                eventHandlers={{
                  click: () => showDirections(hospital),
                  mouseover: () => highlightHospital(hospital),
                  mouseout: () => setHighlightedHospital(null),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2">
                    <h4 className="mb-2 font-semibold">{name}</h4>
                    {hospital.tags?.addr_street && (
                      <div className="flex items-center mb-1 text-sm">
                        <FaMapMarkerAlt className="mr-2 text-blue-500" />
                        <span>{hospital.tags.addr_street}</span>
                      </div>
                    )}
                    {hospital.tags?.phone && (
                      <div className="flex items-center mb-2 text-sm">
                        <FaPhone className="mr-2 text-blue-500" />
                        <a href={`tel:${hospital.tags.phone}`} className="hover:underline">
                          {hospital.tags.phone}
                        </a>
                      </div>
                    )}
                    <button
                      className="flex items-center justify-center w-full gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        openExternalDirections(hospital);
                      }}
                    >
                      <FaRoute /> Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Controls */}
      <MapControls mapRef={mapRef} />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex bg-white shadow-lg md:hidden z-[1000]">
        <button className="flex flex-col items-center justify-center flex-1 py-2 text-blue-500">
          <FaHospital className="mb-1" />
          <span className="text-xs">Hospitals</span>
        </button>
        <button className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500">
          <FaRoute className="mb-1" />
          <span className="text-xs">Directions</span>
        </button>
        <button className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500">
          <FaStar className="mb-1" />
          <span className="text-xs">Saved</span>
        </button>
      </div>
    </div>
  );
};

export default HospitalMap;