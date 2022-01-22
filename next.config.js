const nextTranslate = require("next-translate");
module.exports = nextTranslate({
  reactStrictMode: true,
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["de", "en"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "de",
    localeDetection: false,
  },
  images: {
    domains: ["media.tenor.com"],
  },
});
