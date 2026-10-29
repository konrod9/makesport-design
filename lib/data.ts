export type Sport =
  | "Футбол"
  | "Баскетбол"
  | "Теннис"
  | "Воркаут"
  | "Волейбол"
  | "Бег"
  | "Велоспорт"
  | "Скейтборд";

export type Surface = "Асфальт" | "Резина" | "Газон" | "Паркет" | "Грунт";

export type Venue = {
  id: string;
  name: string;
  city: string;
  address: string;
  sports: Sport[];
  surface: Surface;
  rating: number;
  reviews: number;
  distance: string;
  isFree: boolean;
  isOpen: boolean;
  hasLighting: boolean;
  image: string;
  lat: number;
  lng: number;
  hours: string;
  description: string;
};

export const cities = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург"];

export const surfaces: Surface[] = [
  "Асфальт",
  "Резина",
  "Газон",
  "Паркет",
  "Грунт",
];

export const sports: Sport[] = [
  "Футбол",
  "Баскетбол",
  "Теннис",
  "Воркаут",
  "Волейбол",
  "Бег",
  "Велоспорт",
  "Скейтборд",
];

export const venues: Venue[] = [
  {
    id: "gorodskoy-stadion",
    name: "Городской стадион «Лужники»",
    city: "Москва",
    address: "ул. Лужники, 24, стр. 1",
    sports: ["Футбол", "Бег"],
    surface: "Газон",
    rating: 4.9,
    reviews: 214,
    distance: "0,8 км",
    isFree: false,
    isOpen: true,
    hasLighting: true,
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80",
    lat: 55.7158,
    lng: 37.5538,
    hours: "07:00 — 23:00",
    description:
      "Большое футбольное поле с натуральным газоном, беговые дорожки и трибуны. Работает прокат инвентаря.",
  },
  {
    id: "krylatskoe",
    name: "Спортплощадка «Крылатское»",
    city: "Москва",
    address: "Крылатская ул., 10",
    sports: ["Баскетбол", "Воркаут"],
    surface: "Резина",
    rating: 4.7,
    reviews: 168,
    distance: "1,4 км",
    isFree: true,
    isOpen: true,
    hasLighting: true,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    lat: 55.7569,
    lng: 37.4226,
    hours: "круглосуточно",
    description:
      "Современное резиновое покрытие, баскетбольные кольца, турники и брусья. Освещение работает до полуночи.",
  },
  {
    id: "sokolniki",
    name: "Теннисные корты «Сокольники»",
    city: "Москва",
    address: "Сокольнический Вал, 1Б",
    sports: ["Теннис"],
    surface: "Паркет",
    rating: 4.8,
    reviews: 96,
    distance: "2,1 км",
    isFree: false,
    isOpen: true,
    hasLighting: true,
    image:
      "https://images.unsplash.com/photo-1560012057-4372e14c5085?auto=format&fit=crop&w=1200&q=80",
    lat: 55.7905,
    lng: 37.6765,
    hours: "08:00 — 22:00",
    description:
      "Шесть открытых кортов с профессиональным покрытием. Есть раздевалки, душ и тренер по запросу.",
  },
  {
    id: "gorky-park",
    name: "Воркаут-зона в Парке Горького",
    city: "Москва",
    address: "Крымский Вал, 9",
    sports: ["Воркаут", "Бег"],
    surface: "Резина",
    rating: 4.6,
    reviews: 342,
    distance: "3,2 км",
    isFree: true,
    isOpen: true,
    hasLighting: true,
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80",
    lat: 55.7302,
    lng: 37.6019,
    hours: "круглосуточно",
    description:
      "Популярная площадка с разноуровневыми турниками, брусьями и петлями. Рядом беговая дорожка вдоль набережной.",
  },
  {
    id: "nevsky",
    name: "Спортивный кластер «Невский»",
    city: "Санкт-Петербург",
    address: "наб. реки Мойки, 42",
    sports: ["Баскетбол", "Волейбол"],
    surface: "Асфальт",
    rating: 4.5,
    reviews: 121,
    distance: "1,1 км",
    isFree: true,
    isOpen: false,
    hasLighting: false,
    image:
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80",
    lat: 59.9391,
    lng: 30.3158,
    hours: "08:00 — 21:00",
    description:
      "Две универсальные площадки в центре города. Днём здесь играют студенческие команды, вечером — любители.",
  },
  {
    id: "grebnoi",
    name: "Скейт-парк «Гребной канал»",
    city: "Санкт-Петербург",
    address: "Гребной канал, 1",
    sports: ["Скейтборд", "Велоспорт"],
    surface: "Асфальт",
    rating: 4.4,
    reviews: 87,
    distance: "2,7 км",
    isFree: true,
    isOpen: true,
    hasLighting: true,
    image:
      "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=1200&q=80",
    lat: 59.9744,
    lng: 30.2262,
    hours: "круглосуточно",
    description:
      "Бетонный скейт-парк с рампой, грайнд-боксами и плазой. Подходит для скейтборда, BMX и трюковых самокатов.",
  },
  {
    id: "kazan-arena",
    name: "Площадка у «Казань Арены»",
    city: "Казань",
    address: "пр. Ямашева, 44",
    sports: ["Футбол", "Баскетбол", "Воркаут"],
    surface: "Газон",
    rating: 4.8,
    reviews: 203,
    distance: "0,6 км",
    isFree: true,
    isOpen: true,
    hasLighting: true,
    image:
      "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?auto=format&fit=crop&w=1200&q=80",
    lat: 55.821,
    lng: 49.1609,
    hours: "06:00 — 23:00",
    description:
      "Мини-футбольное поле с искусственным газоном, баскетбольная площадка и воркаут-зона в одном месте.",
  },
  {
    id: "eltsin-center",
    name: "Спортплощадка «Ельцин Центр»",
    city: "Екатеринбург",
    address: "ул. Бориса Ельцина, 3",
    sports: ["Бег", "Воркаут", "Волейбол"],
    surface: "Резина",
    rating: 4.7,
    reviews: 154,
    distance: "1,8 км",
    isFree: true,
    isOpen: true,
    hasLighting: true,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    lat: 56.8431,
    lng: 60.5903,
    hours: "07:00 — 22:00",
    description:
      "Многофункциональная площадка рядом с набережной: волейбол, воркаут и беговая петля на 1,2 км.",
  },
];
