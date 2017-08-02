$(function() {
    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

    // Center map and default zoom level
    map.setView([25, 121.3], 11);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    // Colors for AwesomeMarkers
    var _colorIdx = 0,
        _colors = [
            'orange',
            'green',
            'blue',
            'purple',
            'darkred',
            'cadetblue',
            'red',
            'darkgreen',
            'darkblue',
            'darkpurple'
        ];

    function _assignColor() {
        return _colors[_colorIdx++ % 10];
    }

    // =====================================================
    // =============== Playback ============================
    // =====================================================

    var x = 5;
    var tickLen = 60 * x * 1000; // mili seconds, x mins

    // Playback options
    var playbackOptions = {
        // layer and marker options
        layer: {
            pointToLayer: function(featureData, latlng) {
                var result = {};

                if (featureData && featureData.properties && featureData.properties.path_options) {
                    result = featureData.properties.path_options;
                }

                if (!result.radius) {
                    result.radius = 5;
                }

                return new L.CircleMarker(latlng, result);
            }
        },

        marker: function() {
            return {
                icon: L.AwesomeMarkers.icon({
                    prefix: 'fa',
                    icon: 'bullseye',
                    markerColor: _assignColor()
                })
            };
        },
        tickLen: tickLen,
        speed: tickLen / (100 / x)
    };

    var sub_car = {
        type: "Feature",
        geometry: {
            type: "MultiPoint",
            coordinates: []
        },
        properties: {
            time: []
        }
    }

    var tickInt = 0;
    var ts_start = car.properties.time[0];
    sub_car.properties.time.push(ts_start);
    sub_car.geometry.coordinates.push(car.geometry.coordinates[0]);
    car.properties.time.forEach(function(ts, i) {

        var tmpTickInt = parseInt(ts / tickLen);
        if (tmpTickInt > tickInt) {
            sub_car.properties.time.push(ts);
            sub_car.geometry.coordinates.push(car.geometry.coordinates[i]);
            tickInt = tmpTickInt;
        }
    });



    //sub_car.geometry.coordinates = car.geometry.coordinates.slice(0, 1000);
    //sub_car.properties.time = car.properties.time.slice(0, 1000);


    // Initialize playback
    var playback = new L.Playback(map, sub_car, null, playbackOptions);

    // Initialize custom control
    var control = new L.Playback.Control(playback);
    control.addTo(map);

    // Add data
    // playback.addData(sub_car);

});