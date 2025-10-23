import { showToast, Toast } from "@raycast/api";
import { AirlineMeta } from "soaring-symbols";

export const fetchAirlines = async (): Promise<AirlineMeta[]> => {
  try {
    const res = await fetch("https://raw.githubusercontent.com/anhthang/soaring-symbols/refs/heads/main/airlines.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return await res.json();
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to load airlines",
      message: String(error),
    });

    return [];
  }
};
