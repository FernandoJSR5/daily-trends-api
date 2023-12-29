# Daily Treds API

_Se expone una api rest que consulta en la base de datos MongoDB Atlas las noticias de portada de los periodicos número uno del país. Para realizar pruebas sobre la API hacer click en el siguiente enlance [Swwager UI](http://localhost:8080/api-explorer/)._

## Arquitectura de la aplicación 📐

![arquitectura-daily-trends](https://github.com/FernandoJSR5/daily-trends-api/assets/8022726/c327d38e-8aeb-410b-b302-6001fd151c6f)


## Comenzando 🚀

_Estas instrucciones permiten ejecutar en tu máquina local la api para propósitos de desarrollo y pruebas._

### Ejecutando la aplicación 🔧

_En modo desarrollo_

```
npm run dev
```

_En modo producción_

```
npm run clean
```
```
npm run build
```
```
npm run start
```

## Ejecutando las pruebas ⚙️

_Consta de:_
* Nueve pruebas que validan que la API entrega las noticias ya sea a través de hacer scraping via web o consultado a la base de datos.
* Además de validar la opción de agregar noticias a mano.

_Para ejecutar las pruebas_

```
npm run test:watch
```

_Para validar la covertura del código_

```
npm run test:cov
```

## Construido con 🛠️

* [Express](https://expressjs.com)
* [MongoDB](https://www.mongodb.com)
* [NodeJS](https://nodejs.org/en)
* [TypeScript](https://www.typescriptlang.org)
* [NPM](https://www.npmjs.com)

## Autor ✒️

* **Fernando Salazar** - *Daily Trends API* - [FernandoJS5](https://github.com/FernandoJSR5)
