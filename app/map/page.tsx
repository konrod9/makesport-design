import type { Metadata } from "next";
import { MapLoader } from "@/components/map/map-loader";

export const metadata: Metadata = {
  title: "Карта площадок — MakeSport",
};

export default function MapPage() {
  return <MapLoader />;
}
