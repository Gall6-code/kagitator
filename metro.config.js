// Metro: JSON-файлы данных должны попадать в приложение как АССЕТЫ (файлы),
// а не компилироваться в JS-бандл (41 МБ JS убили бы запуск).
// expo-asset + expo-file-system читают их с диска оффлайн.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('json');

module.exports = config;