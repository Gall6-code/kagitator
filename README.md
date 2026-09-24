# КОГИТАТОР ⚙💀

Оффлайн-библиотека приборов **grandMA2** в стиле Warhammer 40k.
React Native + Expo (Expo Router), работает на **iPhone, Android и (технически) web**.

Логика поиска и данные повторяют сайт [mafixture.ru](https://mafixture.ru/): библиотека grandMA2 3.9.61.5,
35 410 приборов, 1–64 канала, 27 атрибутов, режим «НЕ» (≠). Все данные лежат **внутри приложения**
(`assets/data/*.json`) — интернет не нужен.

## Возможности

- 🔍 Поиск приборов по числу каналов и атрибутам (точное совпадение, как на mafixture.ru; «НЕ» = ≠)
- ⭐ Избранное («Реликварий») — сохраняется на устройстве
- 📜 История поиска («Хроники») — «Воссоздать» повторяет любой запрос
- 💀 Тёмная готическая тема 40k: кость / золото / кровь, шрифт Cinzel

## Быстрый старт на iPhone (бесплатно, без Xcode и Apple Developer)

1. Установи на iPhone приложение **Expo Go** из App Store.
2. Подключи Mac и iPhone к одной Wi-Fi-сети.
3. Запусти дев-сервер на Mac:

   ```bash
   cd CogitatorRN
   ./start.sh          # или: ~/tools/node-v20.20.2-darwin-x64/bin/npx expo start
   ```

4. Открой в Expo Go скан QR-кода (или камерой iPhone наведи на QR из терминала).
5. Приложение «Когитатор» запустится на iPhone. Правь код → авто-перезагрузка.

> Если iPhone не видит сервер (разные сети/фаервол), запусти с туннелем:
> `npx expo start --tunnel`

## Требования к Mac

Node 20+ (уже установлен в `~/tools/node-v20.20.2-darwin-x64` — без brew и прав администратора).
Сам Expo-дев-сервер лёгкий и отлично работает на старом MacBook Air 2015 (Intel, 8 ГБ RAM).

## Полезные команды

```bash
npx tsc --noEmit            # проверка типов
npx expo-doctor            # диагностика проекта
npx expo export --platform ios   # проверить, что бандл и 41 МБ данных собираются в ассеты
```

## Структура

```
src/
  app/                # экраны Expo Router
    _layout.tsx       # корень: шрифты + состояние + стек
    (tabs)/           # Поиск / Реликварий / Хроники
    fixture.tsx       # детали прибора (модалка)
  models.ts           # типы + 27 атрибутов каналов
  library.ts          # оффлайн-загрузка JSON (expo-asset) + логика поиска
  dataIndex.ts        # сгенерированная карта require-ов 64 файлов данных
  state.tsx           # глобальное состояние (избранное/история), AsyncStorage
  components.tsx      # 40k-виджеты
  theme.ts            # палитра и стили
assets/
  data/               # 64 JSON-файла приборов (~41 МБ, оффлайн)
  fonts/              # Cinzel-Variable.ttf
  icon.png            # иконка
```

## Сборка установочных файлов (.ipa / .apk) через EAS Cloud

Тестировать каждый день можно в Expo Go. Когда понадобится отдельное приложение на iPhone без Expo Go:

```bash
npx eas-cli@latest login                 # логин в аккаунт Expo
npx eas-cli@latest build --profile preview --platform ios
```

Локальный Xcode не нужен — сборка идёт в облаке Expo. Для установки на свой iPhone
через EAS нужен **платный Apple Developer** ($99/год) — с бесплатным Apple ID
облачная установка на устройство невозможна (регистрация устройства требует Xcode).

## Данные

Библиотека скачана с mafixture.ru (формат JSON, 64 файла `fixture_{N}_ch.json`).
Данные — © Artem Sysolyatin (mafixture.ru). Товарные знаки принадлежат их владельцам.