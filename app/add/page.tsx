import type { Metadata } from "next";
import { AddVenueForm } from "@/components/venue/add-venue-form";

export const metadata: Metadata = {
  title: "Добавить площадку — MakeSport",
};

export default function AddPage() {
  return <AddVenueForm />;
}
