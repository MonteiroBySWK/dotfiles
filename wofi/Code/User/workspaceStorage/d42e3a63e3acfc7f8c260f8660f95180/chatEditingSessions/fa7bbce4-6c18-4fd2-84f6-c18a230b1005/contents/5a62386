# 🚀 COMANDOS ÚTEIS - AVIGESTOR

## 📦 Instalação e Setup

```bash
# Navegar até o projeto
cd tcc_zoo

# Instalar dependências
flutter pub get

# Verificar instalação do Flutter
flutter doctor

# Listar dispositivos disponíveis
flutter devices
```

## ▶️ Executar Aplicativo

```bash
# Executar em modo debug (device conectado)
flutter run

# Executar em Linux
flutter run -d linux

# Executar em Chrome (Web)
flutter run -d chrome

# Executar em Android
flutter run -d android

# Executar em modo release (mais rápido)
flutter run --release
```

## 🔨 Build

```bash
# Build para Android (APK)
flutter build apk

# Build para Android (App Bundle - Google Play)
flutter build appbundle

# Build para Linux
flutter build linux

# Build para Web
flutter build web
```

## 🧹 Limpeza

```bash
# Limpar build anterior
flutter clean

# Reinstalar dependências após clean
flutter pub get
```

## 🔍 Análise e Qualidade

```bash
# Analisar código
flutter analyze

# Verificar dependências desatualizadas
flutter pub outdated

# Atualizar dependências
flutter pub upgrade

# Formatar código
dart format lib/
```

## 🧪 Testes

```bash
# Executar todos os testes
flutter test

# Executar teste específico
flutter test test/widget_test.dart

# Executar testes com cobertura
flutter test --coverage
```

## 📱 Dispositivos

```bash
# Listar emuladores
flutter emulators

# Iniciar emulador específico
flutter emulators --launch <emulator_id>

# Logs do dispositivo
flutter logs
```

## 🔧 Debug

```bash
# Modo debug com hot reload
flutter run

# Durante execução:
# r = hot reload
# R = hot restart
# q = quit
# p = toggle debug paint
# P = toggle performance overlay
# w = dump widget hierarchy
```

## 📊 Performance

```bash
# Profile mode
flutter run --profile

# Analisar performance
flutter run --profile --trace-startup

# Observatory (debug tools)
flutter run --observatory-port=8888
```

## 🗄️ Banco de Dados

```bash
# Localizar banco de dados SQLite no dispositivo
# Android: adb shell run-as com.example.tcc_zoo ls -R /data/data/com.example.tcc_zoo/

# Exportar banco para análise
# adb pull /data/data/com.example.tcc_zoo/databases/avigestor.db
```

## 📦 Dependências Úteis

```bash
# Adicionar nova dependência
flutter pub add <package_name>

# Exemplo:
flutter pub add pdf

# Remover dependência
flutter pub remove <package_name>
```

## 🌐 Web Specific

```bash
# Executar web com porta específica
flutter run -d chrome --web-port=8080

# Build web otimizado
flutter build web --release --web-renderer canvaskit
```

## 📱 Android Specific

```bash
# Listar dispositivos Android conectados
adb devices

# Instalar APK manualmente
adb install build/app/outputs/flutter-apk/app-release.apk

# Desinstalar app
adb uninstall com.example.tcc_zoo

# Ver logs do app
adb logcat | grep flutter
```

## 🍎 iOS Specific (se disponível)

```bash
# Listar simuladores iOS
xcrun simctl list devices

# Build para iOS
flutter build ios

# Executar em simulador iOS
flutter run -d "iPhone 14 Pro"
```

## 🎨 Assets e Recursos

```bash
# Gerar ícones do app
flutter pub run flutter_launcher_icons:main

# Gerar splash screen
flutter pub run flutter_native_splash:create
```

## 📝 Geração de Código

```bash
# Se usar build_runner no futuro
flutter pub run build_runner build

# Com watch (regenera automaticamente)
flutter pub run build_runner watch

# Limpar código gerado
flutter pub run build_runner clean
```

## 🔐 Release Android

```bash
# Gerar keystore (primeira vez)
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# Build release APK
flutter build apk --release

# Build release App Bundle
flutter build appbundle --release
```

## 📊 Comandos de Projeto

```bash
# Ver estrutura do projeto
tree lib/ -I 'build|.dart_tool'

# Contar linhas de código
find lib -name '*.dart' | xargs wc -l

# Buscar em arquivos
grep -r "palavra" lib/
```

## 🐛 Troubleshooting

```bash
# Problemas com cache
flutter clean
flutter pub cache repair
flutter pub get

# Problemas com gradle (Android)
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get

# Reinstalar dependências
rm -rf pubspec.lock
rm -rf .dart_tool
flutter pub get
```

## 🎯 Comandos Específicos do Projeto

```bash
# Ver versão atual
grep 'version:' pubspec.yaml

# Estrutura de pastas
ls -R lib/

# Tamanho do projeto
du -sh .

# Git (se usar)
git status
git add .
git commit -m "feat: implementa funcionalidade X"
git push
```

## 📱 Teste em Dispositivos Reais

```bash
# Android: Habilitar USB Debugging no dispositivo
# Conectar via USB
adb devices
flutter run

# Wireless debugging (Android 11+)
adb pair <ip>:<port>
adb connect <ip>:<port>
flutter run
```

## 🚀 Deploy

```bash
# Play Store (Android)
flutter build appbundle --release

# APK direto
flutter build apk --split-per-abi

# Web (hosting)
flutter build web --release
# Deploy para Firebase Hosting, Netlify, etc.
```

## 📊 Métricas

```bash
# Tamanho do APK
ls -lh build/app/outputs/flutter-apk/

# Análise de dependências
flutter pub deps

# Árvore de dependências
flutter pub deps --tree
```

## 🔄 Atualização Flutter

```bash
# Verificar versão
flutter --version

# Atualizar Flutter
flutter upgrade

# Mudar de canal
flutter channel stable
flutter upgrade
```

---

## 💡 Dicas Rápidas

- Use `r` durante `flutter run` para hot reload
- Use `R` para hot restart completo
- Use `q` para sair
- Mantenha `flutter doctor` sempre verde ✅
- Limpe o cache regularmente com `flutter clean`

## 🎯 Workflow Recomendado

```bash
# 1. Iniciar desenvolvimento
flutter clean && flutter pub get

# 2. Executar app
flutter run -d linux

# 3. Durante desenvolvimento
# Salvar arquivo = hot reload automático

# 4. Antes de commit
flutter analyze
dart format lib/
flutter test

# 5. Build final
flutter build apk --release
```

---

**Todos os comandos prontos para usar no AviGestor!** 🚀
