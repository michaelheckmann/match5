import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../i18n.json";

const { locales } = i18nConfig;

export default function LanguageSelector() {
  const { t } = useTranslation("common");

  return (
    <div className="flex divide-x-2 divide-fuchsia-800">
      {locales.map((lng) => (
        <div
          className="flex items-center justify-center px-4 py-1 transition cursor-pointer text-fuchsia-800 hover:font-bold "
          key={lng}
        >
          <Link href="/" locale={lng}>
            {t(`lang.${lng}`)}
          </Link>
        </div>
      ))}
    </div>
  );
}
