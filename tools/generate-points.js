#!/usr/bin/env node

const fs = require('fs');
const got = require('got');
const yaml = require('js-yaml');
const GEOCODER_API = 'https://geocode-maps.yandex.ru/1.x/';
const data = yaml.safeLoad(fs.readFileSync(__dirname + '/../data/companies.yaml', 'utf8'));

(async function () {
    const points = await Promise.all(data.map(async (company) => {
        company.houses = await geocodeCompanyHouses(company.items);
        return company;
    }));

    fs.writeFileSync(__dirname + '/../build/data.js', 'const data = ' + JSON.stringify(points, null, 4));
})();

async function geocodeCompanyHouses(items) {
    return Promise.all(items.reduce((result, item) => {
        return result.concat(item.houses.map((house) => geocode(`Москва, ${item.street}, ${house}`)));
    }, []));
}

async function geocode(address) {
    const result = await got(GEOCODER_API, {
        query: {
            geocode: address,
            lang: 'ru_RU',
            kind: 'house',
            format: 'json'
        },
        json: true
    });

    const geoObject = result.body.response.GeoObjectCollection.featureMember[0].GeoObject;
    return {
        address: geoObject.metaDataProperty.GeocoderMetaData.text,
        point: geoObject.Point.pos.split(' ').reverse().map(Number)
    };
}
