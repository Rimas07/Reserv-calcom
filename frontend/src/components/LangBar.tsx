import { Lang } from '../i18n';

const langs: { code: Lang; label: string }[] = [
  { code: 'cs', label: 'CZ' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UA' },
];

interface Props {
  lang: Lang;
  onChange: (l: Lang) => void;
}

export default function LangBar({ lang, onChange }: Props) {
  return (
    <div className="lang-bar">
      {langs.map(({ code, label }) => (
        <button
          key={code}
          className={`lang-btn${lang === code ? ' active' : ''}`}
          onClick={() => onChange(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
