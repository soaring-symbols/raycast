import { showToast, Toast } from "@raycast/api";
import { Airline } from "../types";
import { normalizeFill } from ".";
import { AIRLINES_URL } from "./airlines";

export const fetchAirlines = async (): Promise<Airline[]> => {
  try {
    const res = await fetch(AIRLINES_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return (await res.json()) as Airline[];
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to load airlines",
      message: String(error),
    });

    return [];
  }
};

export const getSVGContent = async (url: string, monochrome: boolean = false) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch SVG");
  const svg = await res.text();

  return monochrome ? normalizeFill(svg) : svg;
};
