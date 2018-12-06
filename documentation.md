# Dokumentácia

Webová aplikácia implementuje tri prípady použitia:

* priemerný vek úmrtia v jednotlivých častiach Lake County

![alt text](https://github.com/Sue425/assignment-gis/blob/master/images/mortality_rate.png "Priemerný vek úmrtnosti")

* štatistika nemocníc

![alt text](https://github.com/Sue425/assignment-gis/blob/master/images/hospital_statistics.png  "Štatistika nemocníc")

* najbližšia nemocnica

![alt text](https://github.com/Sue425/assignment-gis/blob/master/images/nearest_hospital.png  "Najbližšia nemocnica")

  

# Frontend

* na zobrazenie mapy a pridávanie vrstiev je použitý Mapbox

* štruktúra frontendu je implementovaná v `index.html` a logika (volania REST API) je v `application.js`

# Backend

* napísaný v `Pythone` s použitím microframeworku `Flask`

* použitý databázový adaptér `psycopg2`

* pripojenie na databázu v module `database.py`

* obsahuje REST API a dopytovanie do databázy

* dopyty do databázy sú načítané zo súboru `queries.json`

## Dáta

Na transformáciu dát z `geojson` fromátu do `PostgreSQL` bol použitý program `ogr2ogr`. Dáta z `OpenStreetMaps` boli importované použitím `osm2pgsql`.

*  [Lake County](https://www.openstreetmap.org)
*  [nemocnice](https://www.openstreetmap.org)
*  [štatistika úmrtnosti](https://catalog.data.gov/dataset/mortality-rates-b7080)

## REST API

Server zachytáva 8 ciest:

* `/` - landing page

*  `/county` - načítanie hraníc Lake County

* `/hospitals` - zobrazenie všetkých nemocníc v oblasti

*  `/mortality` - ofarbenie okresov podľa priemerného veku úmrtia

*  `/stats` - štatistika nemocníc

*  `/geocode` - transformácia adresy na bod na mape pomocou Mapbox Geocoding API

* `/closest` - vyhľadanie najbližšej nemocnice podľa súradníc

* `/pin` - trasformácia súradníc na bod na mape

## Postgis

Dopyty do databázy sú v `queries.json`. Použité `postgis` funkcie:

  
* ST_Contains

* ST_Transform

* ST_AsGeoJSON

* ST_Centroid

* ST_Distance

* ST_Point

* ST_SetSRID
