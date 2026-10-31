import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Мой профиль — MakeSport",
  description:
    "Личный кабинет MakeSport: ваши площадки, отзывы, достижения и настройки профиля.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
