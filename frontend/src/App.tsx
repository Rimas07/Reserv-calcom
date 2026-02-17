import { useState, useEffect } from 'react';
import { Lang, t } from './i18n';
import LangBar from './components/LangBar';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import ConfirmScreen from './components/ConfirmScreen';

type Screen = 'home' | 'booking' | 'confirm';

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('rez_lang') as Lang | null;
    return saved && ['cs', 'en', 'ru', 'uk'].includes(saved) ? saved : 'cs';
  });
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedCalLink, setSelectedCalLink] = useState('');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t(lang, 'clinicName') + ' – Online rezervace';
  }, [lang]);

  function changeLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('rez_lang', l);
  }

  function openService(calLink: string) {
    setSelectedCalLink(calLink);
    setScreen('booking');
    window.scrollTo(0, 0);
  }

  function goHome() {
    setScreen('home');
    window.scrollTo(0, 0);
  }

  function onBooked() {
    setScreen('confirm');
    window.scrollTo(0, 0);
  }

  return (
    <div className="container">
      <LangBar lang={lang} onChange={changeLang} />
      {screen === 'home' && (
        <HomeScreen lang={lang} onSelectService={openService} />
      )}
      {screen === 'booking' && (
        <BookingScreen
          lang={lang}
          calLink={selectedCalLink}
          onBack={goHome}
          onBooked={onBooked}
        />
      )}
      {screen === 'confirm' && (
        <ConfirmScreen lang={lang} onBack={goHome} />
      )}
    </div>
  );
}
