ymaps.ready(() => {
    const map = new ymaps.Map('map', {
        center: [55.568395, 37.570253],
        zoom: 15
    });

    data.forEach((company) => {
        company.houses.forEach((house) => {
            const marker = new ymaps.Placemark(
                house.point,
                {
                    balloonContent: `<a target="blank" href="${company.url}"><strong>${company.title}</strong></a><br/>${house.address}`
                },
                {
                    preset: 'islands#circleDotIcon',
                    iconColor: company.color
                }
            );
            map.geoObjects.add(marker);
        });
    });
});
