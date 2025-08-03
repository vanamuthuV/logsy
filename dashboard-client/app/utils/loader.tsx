export const fetchLogs = async () => {
  const url = "http://127.0.0.1:6060/logs";

  try {
    console.log("🌐 Fetching logs from:", url);

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`❌ HTTP ${res.status}: ${res.statusText}`);
    }

    const logs = await res.json();
    console.log(`✅ Fetched ${logs.length} logs`);
    return logs;
  } catch (err : any) {
    if (err.name === "AbortError") {
      console.error("🚨 Request timeout");
    } else {
      console.error("🚨 Error fetching logs:", err.message);
    }
    return [];
  }
};
