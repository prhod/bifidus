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

osmose_issues_to_display = get_issues_to_display_from_url()

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

    var all_issues_tags = ['1260_1', '1260_2', '1260_3', '1260_4', '8040', '2140_21402', '2140_21403',
        '2140_21404', '2140_21405', '2140_21401', '2140_21411', '2140_21412',
        'line_info'
    ];
    for (var i = 0; i < osmose_issues_to_display.length; i++) {
        issue = osmose_issues_to_display[i];
        if (all_issues_tags.includes(issue)) {
        }
    }
    if (osmose_issues_to_display === '1260_1' || osmose_issues_to_display === 'all') {
        generic_osmose("1260_1", "1260", "1", display_info_1260_1);
    }
    if (osmose_issues_to_display === '1260_2' || osmose_issues_to_display === 'all') {
        generic_osmose("1260_2", "1260", "2", display_info_1260_2);
    }
    if (osmose_issues_to_display === '1260_3' || osmose_issues_to_display === 'all') {
        generic_osmose("1260_3", "1260", "3", display_info_1260_3);
    }
    if (osmose_issues_to_display === '1260_4' || osmose_issues_to_display === 'all') {
        generic_osmose("1260_4", "1260", "4", display_info_1260_4);
    }
    if (osmose_issues_to_display === '2140_21402' || osmose_issues_to_display === 'all') {
        generic_osmose("2140_21402", "2140", "21402", display_info_2140_21402);
    }
    if (osmose_issues_to_display === '2140_21403' || osmose_issues_to_display === 'all') {
        generic_osmose("2140_21403", "2140", "21403", display_info_2140_21403);
    }
    if (osmose_issues_to_display === '2140_21404' || osmose_issues_to_display === 'all') {
        generic_osmose("2140_21404", "2140", "21404", display_info_2140_21404);
    }
    if (osmose_issues_to_display === '2140_21405' || osmose_issues_to_display === 'all') {
        generic_osmose("2140_21405", "2140", "21405", display_info_2140_21404);
    }


    //other
    if (osmose_issues_to_display === '2140_21401' || osmose_issues_to_display === 'all') {
        generic_osmose('2140_21401', '2140', '21401')
    }
    if (osmose_issues_to_display === '2140_21411' || osmose_issues_to_display === 'all') {
        generic_osmose('2140_21411', '2140', '21411')
    }
    if (osmose_issues_to_display === '2140_21412' || osmose_issues_to_display === 'all') {
        generic_osmose('2140_21412', '2140', '21412')
    }
    if (osmose_issues_to_display === '8040' || osmose_issues_to_display === 'all') {
        generic_osmose('8040', '8040')
    }

    function generic_osmose(osmose_name, osmose_item, osmose_class, display_function) {
        var osmose_tiles_url = "https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/map/issues/{z}/{x}/{y}.mvt?"
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

        if (display_function) {
            map.on('click', "issues_" + osmose_name, display_function);
        } else {
            map.on('click', "issues_" + osmose_name, display_generic);
        }
    }
})

function get_issues_to_display_from_url() {
    var osmose_issues = ['1260_1', '1260_2', '1260_3', '1260_4', '8040', '2140_21402', '2140_21403',
        '2140_21404', '2140_21405', '2140_21401', '2140_21411', '2140_21412',
        'line_info'
    ]
    osmose_issues_to_display = get_parameter_from_url("issues")
    if (!osmose_issues.includes(osmose_issues_to_display)) {
        var osmose_issues_to_display = "all"
        console.log("Le numéro Osmose passé dans l'URL n'est pas valide, on affiche tout")
    }
    return osmose_issues_to_display
}
