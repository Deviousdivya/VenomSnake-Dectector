export interface Coords {
  lat: number;
  lng: number;
  accuracy?: number;
}

/** Current position with a hard timeout, so the UI never waits forever on an ignored permission prompt. */
export function getCoords(timeoutMs = 10000): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Location is not supported on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? 'Location permission was denied. Allow location access in your browser to use this.'
              : 'We could not get your location. Check that GPS is on and try again.'
          )
        ),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30000 }
    );
  });
}

export const mapsPinUrl = (c: Coords) => `https://www.google.com/maps?q=${c.lat},${c.lng}`;

export function readAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.readAsDataURL(file);
  });
}
