// Metro: поведение с JSON-файлами данных различается:
// - в dev (Expo Go) Metro ВСТРАИВАЕТ .json в JS-бандл — require() отдаёт массив;
// - в production .json упаковывается как АССЕТЫ (файлы внутри .app/.apk).
// Загрузчик в src/library.ts учитывает оба варианта (Array.isArray → данные
// из бандла, число → ассет с диска через expo-asset + expo-file-system).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('json');

module.exports = config;