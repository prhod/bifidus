var map = new mapboxgl.Map({
    container: 'map',
    style: 'glstyle.json',
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

var osmose_issues_to_display = get_issues_to_display_from_url()

map.on('load', function() {
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

    map.on('click', popup_element.remove);

    for (var i = 0; i < osmose_issues_to_display.length; i++) {
        issue = osmose_issues_to_display[i];
        create_layer(issue);
        var display_function = window["display_info_"+issue];
        if (typeof display_function === "function"){
            map.on('click', "issues_" + issue, display_function);
        } else {
            map.on('click', "issues_" + issue, display_generic);
        }
    }

    function create_layer(osmose_name) {
        var osmose_tiles_url = "https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/map/issues/{z}/{x}/{y}.mvt?";
        var osmose_name_array = osmose_name.split("_");
        var osmose_item = osmose_name_array[0];
        var osmose_class = (osmose_name_array.length > 1) ? osmose_name_array[1] : false;
        osmose_tiles_url += "item=" + osmose_item
        if (osmose_class) {
            osmose_tiles_url += "&class=" + osmose_class
        }
        map.addLayer({
            "id": "issues_" + osmose_name,
            "type": "symbol",
            "source": {
                'type': 'vector',
                "tiles": [osmose_tiles_url],
                "attribution": "Osmose",
                "minzoom": 12
            },
            "source-layer": "issues",
            "layout": {
                "icon-image": "{item}"
            }
        });

        change_cursor_under_the_mouse("issues_" + osmose_name);
    }
})

function get_issues_to_display_from_url() {
    var all_osmose_issues = ['1260_1', '1260_2', '1260_3', '1260_4', '8040', '2140_21402', '2140_21403',
        '2140_21404', '2140_21405', '2140_21401', '2140_21411', '2140_21412'
    ];
    var line_issues = ['2140_21402', '2140_21403','2140_21404', '2140_21405'];
    var osmose_issues_to_display = get_parameter_from_url("issues");
    if (typeof(osmose_issues_to_display) == "string") {
        osmose_issues_to_display = [osmose_issues_to_display];
    }
    if (osmose_issues_to_display.includes('all')) {
        return all_osmose_issues;
    } else if (osmose_issues_to_display.includes('line_info')) {
        // adding all the values of "line_issues" alias
        osmose_issues_to_display = osmose_issues_to_display.concat(line_issues);
        // removing non existing value, dupplicates and aliases
        osmose_issues_to_display = osmose_issues_to_display.filter(
            function(item, pos, self) {
                return ((self.indexOf(item) == pos) && (all_osmose_issues.includes(item)));
            }
        );
    }
    if (osmose_issues_to_display.length > 0) {
        return osmose_issues_to_display;
    } else {
        console.log("Le numéro Osmose passé dans l'URL n'est pas valide, on affiche tout")
        return all_osmose_issues;
    }
}
