var map = new mapboxgl.Map({
    container: 'map',
    style: 'glstyle.json',
    center: [
        2.4067, 48.7031
    ],
    zoom: 14,
    hash: true
});

var popup = document.getElementById('popup');

function hidePopup(){
    popup.style.display = 'none';
    document.getElementById("map").style.gridColumnStart = 1;
    document.getElementById("map").style.gridColumnEnd = 3;
    document.getElementById("map").style.gridRowStart = 1;
    document.getElementById("map").style.gridRowEnd = 3;
    map.resize();
}
hidePopup();

function showPopup(){
  popup.style.display = 'inline-block';
  document.getElementById("map").style.gridColumnStart = 1;
  document.getElementById("map").style.gridColumnEnd = 2;
  document.getElementById("map").style.gridRowStart = 1;
  document.getElementById("map").style.gridRowEnd = 2;
  map.resize();
}

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

map.on('load', function() {

    map.addLayer({
        "id": "poi",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "filter": [
            "all", [
                "==",
                "$type",
                "Point"
            ],
            [
                "==",
                "subclass",
                "bus_stop"
            ],
            [
                "==",
                "class",
                "bus"
            ],
        ],
        "layout": {
            "text-padding": 2,
            "text-font": [
                "Noto Sans Regular"
            ],
            "text-anchor": "top",
            "icon-image": "{class}_11",
            "icon-allow-overlap": true,
            "text-field": "{name}",
            "text-offset": [
                0,
                0.6
            ],
            "text-size": 12,
            "text-max-width": 9
        },
        "paint": {
            "text-halo-blur": 0.5,
            "text-color": "#666",
            "text-halo-width": 1,
            "text-halo-color": "#ffffff"
        }
    });


    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-3010.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('8040', image);
    });
    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-0.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('2140', image);
    });
    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-5010.png', function(error, image) {
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
        "id": "issues_",
        "type": "symbol",
        "source": "osmose",
        "source-layer": "issues",
        /*"filter": [
            "==", "item", 8040
        ],*/
        "layout": {
            "icon-image": "{item}",
            "icon-anchor": "bottom"
        }
    });

    map.on('mouseenter', 'issues_', function(e) {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'issues_', function() {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', function(e) {
      hidePopup();
    });

    map.on('click', 'issues_', display_info);

    async function display_info(e) {
        map.flyTo({
            center: e.features[0].geometry.coordinates,
            zoom: 18
        });

        var item_id = e.features[0]['properties']['item'];

        try {
            var osmose_url = "https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/api/0.2/error/" + e.features[0].properties.issue_id
            var osmose_response = await fetch(osmose_url);
            var osmose_data = await osmose_response.json();
            if (item_id == 8040) {
                var popup_content = "<b>Cet arrêt semble manquant</b> <br/>"
                popup_content += osmose_data['subtitle']
                var mapcontrib_url = 'https://www.cartes.xyz/t/e7200d-Arrets_de_bus#position/18/' + e.features[0].geometry.coordinates[1] + '/' + e.features[0].geometry.coordinates[0];
                popup_content += "<br><a target='blank_' href='" + mapcontrib_url + "'>Voir sur MapContrib</a>"
            } else {
                var popup_content = "<b>" + osmose_data['title'] + "</b><br/>"
                popup_content += osmose_data['subtitle']
                for (elem_id in osmose_data['elems']) {
                    elem = osmose_data['elems'][elem_id]
                    var osm_url = 'http://osm.org/' + elem['type'] + '/' + elem['id'];
                    popup_content += "<br><a target='blank_' href='" + osm_url + "'>Voir sur OSM</a>"
                }
            }

          popup.innerHTML = popup_content
          showPopup();
        } catch (err) {
            console.log("erreur en récupérant les infos d'Osmose : " + err)
        }
    }
})
