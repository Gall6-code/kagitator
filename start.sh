#!/bin/bash
# Запуск Expo-дев-сервера со старым MacBook (Node 20 из ~/tools без админ-прав)
export PATH="$HOME/tools/node-v20.20.2-darwin-x64/bin:$PATH"
cd "$(dirname "$0")"
exec npx expo start