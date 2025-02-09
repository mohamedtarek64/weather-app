import { ref } from "vue";

export function useGeolocation() {
  const coords = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const getLocation = () => {
    if (!("geolocation" in navigator)) {
      error.value = new Error("Geolocation is not supported in this browser.");
      return;
    }

    loading.value = true;
    error.value = null;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        loading.value = false;
      },
      (geoError) => {
        error.value =
          geoError.code === geoError.PERMISSION_DENIED
            ? new Error("Location permission was denied.")
            : new Error("We couldn't determine your current location.");
        loading.value = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return {
    coords,
    error,
    loading,
    getLocation,
  };
}
