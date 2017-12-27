var map = new mapboxgl.Map({
    container: 'map',
    style: 'positron_glstyle.json',
    center: [
        2.4067, 48.7031
    ],
    zoom: 14,
    hash: true
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

map.on('load', function () {
    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-3010.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('8040', image);
    });
    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-0.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('2140', image);
    });
    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-5010.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('1260', image);
    });
    map.addSource('osmose', {
        "type": 'vector',
        "tiles": ["https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/map/issues/{z}/{x}/{y}.mvt?item=8040,1260,2140"],
        "attribution": "Osmose",
        "minzoom": 12
    });

    map.addLayer({
        "id": "issues_", "type": "symbol", "source": "osmose", "source-layer": "issues",
        /*"filter": [
            "==", "item", 8040
        ],*/
        "layout": {
            "icon-image": "{item}"
        }
    });
    map.on('mouseenter', 'issues_', function (e) {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'issues_', function () {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', 'issues_', function (e) {
        var popup = new mapboxgl.Popup().setLngLat(e.features[0].geometry.coordinates).setHTML(
            "<br><a target='blank_' href='http://osmose.openstreetmap.fr/fr/api/0.2/error/" + e.features[0].properties.issue_id + "'>Voir cette erreur</a>"
        )
        popup.addTo(map);
        var item_id = e.features[0]['properties']['item'];
        console.log(e.features[0])

        fetch("https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/api/0.2/error/" + e.features[0].properties.issue_id).then(function (res) {
            if (res.ok) {
                res.json().then(function (data) {
                    if (item_id == 8040) {
                        var popup_content = "<b>Cet arrêt semble manquant</b> <br/>"
                        popup_content += data['subtitle']
                        var mapcontrib_url = 'https://www.cartes.xyz/t/e7200d-Arrets_de_bus#position/18/' + e.features[0].geometry.coordinates[1] + '/' + e.features[0].geometry.coordinates[0];
                        popup_content += "<br><a target='blank_' href='" + mapcontrib_url + "'>Voir sur MapContrib</a>"
                    } else {
                        var popup_content = "<b>" + data['title'] + "</b><br/>"
                        popup_content += data['subtitle']
                        for (elem_id in data['elems']) {
                            elem = data['elems'][elem_id]
                            var osm_url = 'http://osm.org/' + elem['type'] + '/' + elem['id'];
                            popup_content += "<br><a target='blank_' href='" + osm_url + "'>Voir sur OSM</a>"
                        }
                    }
                    popup.setHTML(popup_content)
                });
            } else {
                console.log("Fetch failed!", res.status);
            }
        }, function (e) {
            console.log("Fetch failed!", e);
        });
    });
})