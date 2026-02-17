export type Lang = 'cs' | 'en' | 'ru' | 'uk';

export const translations: Record<Lang, Record<string, string>> = {
  cs: {
    clinicName: 'Urologická klinika',
    bannerOpen: 'Online rezervace je otevřena',
    bannerSub: 'Vyberte si vhodný termín',
    ourServices: 'Služby',
    parking: 'Parkování',
    hoursValue: 'Po-Pá 8:00-17:00',
    svc1: 'Primární konzultace',
    svc1d: 'Vyšetření, anamnéza, objednání vyšetření',
    svc1dur: '30 min',
    bookHint: '👆 Vyberte službu pro objednání',
    selectDateTime: 'Výběr termínu',
    bookingConfirmed: 'Rezervace potvrzena!',
    smsSent: 'Potvrzení bylo odesláno na váš email',
    reminderText: '📍 Nezapomeňte: Vezměte s sebou kartičku pojištěnce a občanský průkaz. Přijďte 10 minut před vyšetřením.',
    backHome: 'Zpět na hlavní stránku',
  },
  en: {
    clinicName: 'Urology Clinic',
    bannerOpen: 'Online booking is open',
    bannerSub: 'Choose your preferred time slot',
    ourServices: 'Services',
    parking: 'Parking',
    hoursValue: 'Mon-Fri 8:00-17:00',
    svc1: 'Initial consultation',
    svc1d: 'Examination, medical history, ordering tests',
    svc1dur: '30 min',
    bookHint: '👆 Select a service to book',
    selectDateTime: 'Choose date & time',
    bookingConfirmed: 'Booking confirmed!',
    smsSent: 'Confirmation has been sent to your email',
    reminderText: "📍 Don't forget: Bring your insurance card and ID. Arrive 10 minutes before your appointment.",
    backHome: 'Back to main page',
  },
  ru: {
    clinicName: 'Урологическая клиника',
    bannerOpen: 'Онлайн-запись открыта',
    bannerSub: 'Выберите удобное время прямо сейчас',
    ourServices: 'Услуги',
    parking: 'Парковка',
    hoursValue: 'Пн-Пт 8:00-17:00',
    svc1: 'Первичная консультация',
    svc1d: 'Осмотр, сбор анамнеза, назначение обследований',
    svc1dur: '30 мин',
    bookHint: '👆 Выберите услугу для записи',
    selectDateTime: 'Выберите время',
    bookingConfirmed: 'Запись подтверждена!',
    smsSent: 'Подтверждение отправлено на ваш email',
    reminderText: '📍 Не забудьте: Принесите карту страховки и удостоверение личности. Приходите за 10 минут до приёма.',
    backHome: 'На главную',
  },
  uk: {
    clinicName: 'Урологічна клініка',
    bannerOpen: 'Онлайн-запис відкритий',
    bannerSub: 'Оберіть зручний час прямо зараз',
    ourServices: 'Послуги',
    parking: 'Парковка',
    hoursValue: 'Пн-Пт 8:00-17:00',
    svc1: 'Первинна консультація',
    svc1d: 'Огляд, збір анамнезу, призначення обстежень',
    svc1dur: '30 хв',
    bookHint: '👆 Оберіть послугу для запису',
    selectDateTime: 'Оберіть час',
    bookingConfirmed: 'Запис підтверджено!',
    smsSent: 'Підтвердження відправлено на ваш email',
    reminderText: '📍 Не забудьте: Візьміть з собою картку страхування та посвідчення особи. Прийдіть за 10 хвилин до прийому.',
    backHome: 'На головну',
  },
};

export const calLocaleMap: Record<Lang, string> = {
  cs: 'cs',
  en: 'en',
  ru: 'ru',
  uk: 'uk',
};

export const services = [
  { key: 'svc1', icon: '🔬', calLink: 'zorych-clinic/primarni-konzultace' },
];

export function t(lang: Lang, key: string): string {
  return translations[lang]?.[key] ?? translations.cs[key] ?? key;
}
