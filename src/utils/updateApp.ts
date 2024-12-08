export async function checkForUpdates(): Promise<{
  updateAvailable: boolean;
  currentVersion: string;
  newVersion?: string;
}> {
  if (!("serviceWorker" in navigator)) {
    return { updateAvailable: false, currentVersion: "not supported" };
  }

  try {
    // Get current cache version
    const keys = await caches.keys();
    const currentVersion = keys.find((key) => key.startsWith("v")) || "unknown";

    // Unregister current service worker
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((reg) => reg.unregister()));

    // Clear all caches
    await Promise.all(keys.map((key) => caches.delete(key)));

    // Reload the page to register new service worker
    window.location.reload();

    return {
      updateAvailable: true,
      currentVersion,
    };
  } catch (error) {
    console.error("Error checking for updates:", error);
    return { updateAvailable: false, currentVersion: "error" };
  }
}
