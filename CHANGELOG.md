## 1.0.0 (2026-09-18)

### Features

* adiciona suporte a Docker com job de validação sob demanda no CI ([863b2f9](https://github.com/ThomasTDS/qa-selenium-sd/commit/863b2f9c011503812f0016290ce7adc660c65399))
* roda a suite em 2 workers em paralelo ([dfac8c3](https://github.com/ThomasTDS/qa-selenium-sd/commit/dfac8c3ec6a4ea175f4da8961b493e1bee151294))

### Bug Fixes

* adiciona ca-certificates ao Dockerfile para o wget validar HTTPS ([5a3fb61](https://github.com/ThomasTDS/qa-selenium-sd/commit/5a3fb61e69e0a1042371104324c6bb9269870265))
* adiciona retry para absorver flakiness do site alvo em CI ([de3d1ea](https://github.com/ThomasTDS/qa-selenium-sd/commit/de3d1ea9f2c8c237a6b70469f348eade295b306a))
* serializa o job docker depois do e2e para evitar carga concorrente no site ([1de3e1d](https://github.com/ThomasTDS/qa-selenium-sd/commit/1de3e1deb01fd13993353b468999b731a9a5c61d))
