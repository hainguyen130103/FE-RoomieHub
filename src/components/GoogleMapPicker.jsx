import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const GoogleMapPicker = ({ onLocationSelect, isVisible, onHide, currentLat, currentLng }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: currentLat || 21.0285,
    lng: currentLng || 105.8542,
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isVisible && !map) {
      loadGoogleMaps();
    }
  }, [isVisible]);

  const loadGoogleMaps = () => {
    // Kiểm tra xem Google Maps API đã được load chưa
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Load Google Maps API
      const script = document.createElement('script');
      const apiKey = 'AIzaSyDhK9ZIc0YmXrA9GVCu0G6z2gDC523LDX4';
     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    const markerInstance = new window.google.maps.Marker({
      position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      map: mapInstance,
      draggable: true,
      title: 'Vị trí của bạn'
    });

    // Xử lý sự kiện click trên map
    mapInstance.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      markerInstance.setPosition(event.latLng);
      setSelectedLocation(prev => ({ ...prev, lat, lng }));
      
      // Lấy địa chỉ từ tọa độ
      getAddressFromCoordinates(lat, lng);
    });

    // Xử lý sự kiện drag marker
    markerInstance.addListener('dragend', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedLocation(prev => ({ ...prev, lat, lng }));
      getAddressFromCoordinates(lat, lng);
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    setLoading(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results[0]) {
        const address = response.results[0].formatted_address;
        setSelectedLocation(prev => ({ ...prev, address }));
      }
    } catch (error) {
      console.error('Error getting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    onLocationSelect({
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      address: selectedLocation.address
    });
    onHide();
  };

  const handleSearchLocation = () => {
    if (!map) return;

    const input = document.createElement('input');
    input.placeholder = 'Nhập địa chỉ để tìm kiếm...';
    input.className = 'w-full p-3 border rounded-lg mb-4';
    
    const searchBox = new window.google.maps.places.SearchBox(input);
    
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
      
      setSelectedLocation({
        lat,
        lng,
        address: place.formatted_address
      });
    });
  };

  return (
    <Dialog
      header="Chọn vị trí trên bản đồ"
      visible={isVisible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '800px' }}
      modal
      className="p-fluid"
    >
      <div className="space-y-4">
        {/* Search Box */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập địa chỉ để tìm kiếm..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchLocation();
              }
            }}
          />
          <Button
            label="Tìm kiếm"
            icon="pi pi-search"
            className="border-2 border-blue-600 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200"
            onClick={handleSearchLocation}
          />
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="w-full h-96 border rounded-lg"
          style={{ minHeight: '400px' }}
        />

        {/* Selected Location Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Thông tin vị trí đã chọn:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Latitude:</span>
              <span className="ml-2">{selectedLocation.lat.toFixed(6)}</span>
            </div>
            <div>
              <span className="font-medium">Longitude:</span>
              <span className="ml-2">{selectedLocation.lng.toFixed(6)}</span>
            </div>
          </div>
          {selectedLocation.address && (
            <div className="mt-2">
              <span className="font-medium">Địa chỉ:</span>
              <span className="ml-2">{selectedLocation.address}</span>
            </div>
          )}
          {loading && (
            <div className="mt-2 text-blue-600">
              <i className="pi pi-spin pi-spinner mr-2" />
              Đang lấy địa chỉ...
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            label="Hủy"
            className="border-2 border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-700 font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200"
            onClick={onHide}
          />
          <Button
            label="Xác nhận vị trí"
            icon="pi pi-check"
            className="border-2 border-green-600 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200"
            onClick={handleConfirmLocation}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default GoogleMapPicker; 