eidom = document.getElementById('extra_info')
var map_state = {
    crood: null,
    loc: null,
    upperLayer: null
}
const overlay = new ol.Overlay({
    element: eidom,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});
const view = new ol.View({
    center: [0, 0],
    maxZoom: 15,
    zoom: 2,
    minZoom: 2,
})
const topo = new ol.layer.Tile({
    source: new ol.source.XYZ({

        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    })
})


const osm = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visibile: false
})
const perma = new ol.layer.Tile({
    opacity: 0.5,
    source: new ol.source.TileArcGISRest({
        url: 'https://maps.nccs.nasa.gov/server/rest/services/global_landslide_catalog/landslide_susceptibility/MapServer',
        ratio: 1,
        params: {},
    }),
})
const curr = new ol.layer.Tile({
    opacity: 0.5,
    source: new ol.source.TileArcGISRest({
        url: 'https://maps.nccs.nasa.gov/image01/rest/services/lhasa20/lhasa_hazard/MapServer/',
        ratio: 1,
        params: { 'time': Date.now() },
    }),
})


var map_us = new ol.layer.Heatmap({
    source: new ol.source.Vector({
        url: servers.query.url + '/map_us.geojson',
        format: new ol.format.GeoJSON()
    }),

    weight: function(feature) {
        return parseFloat(feature.get('prediction'))
    }

})

var map_ls = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: servers.query.url + '/map_ls.geojson',
        format: new ol.format.GeoJSON()
    }),

    weight: function(feature) {
        return parseFloat(feature.get('prediction'))
    }

})

var map_help = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: servers.query.url + '/help.geojson',
        format: new ol.format.GeoJSON()
    }),


})
map_ls.setStyle(
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#ff0',
            }),
            stroke: new ol.style.Stroke({
                color: '#00f',
                width: 2,
            }),
        }),
    })
);
map_help.setStyle(
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#f00',
            }),
            stroke: new ol.style.Stroke({
                color: '#0ff',
                width: 2,
            }),
        }),
    })
);

const map = new ol.Map({
        controls: ol.control.defaults({ attribution: false }),
        target: 'map',
        layers: [
            osm,
            topo,
            map_us,
            map_ls,
            map_help,
            perma,
            curr
        ],
        overlays: [overlay],
        view: view
    })
    //const map_pred_perma = new ol.Map({
    //    target: 'map_pred_perma',
    //    layers: [
    //        perma
    //    ],
    //    view: view
    //});
    //const map_pred_curr = new ol.Map({
    //    target: 'map_pred_curr',
    //    layers: [
    //        curr
    //    ],
    //    view: view
    //})









//Geoloaction

const geolocation = new ol.Geolocation({
    trackingOptions: {
        enableHighAccuracy: true,
    },
    projection: view.getProjection(),
});
geolocation.setTracking(true)

const accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});


const positionFeature = new ol.Feature();
positionFeature.setStyle(
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC',
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2,
            }),
        }),
    })
);

geolocation.on('change:position', function() {
    const coordinates = geolocation.getPosition();
    map_state.loc = ol.proj.toLonLat(coordinates)
    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
});

new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: [accuracyFeature, positionFeature],
    }),
})

//end of geoloc

map.on('singleclick', function(evt) {
    var found = false;
    hide('layer_chooser')
    map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        //if (!found) {
        if (feature.get('_id') != undefined) {
            console.log(feature.get('_id'));
            console.log(feature)
            if (map_state.upperLayer == 'map_us') us_render(feature.get('_id'))
            if (map_state.upperLayer == 'user_help') help_render(feature.get('_id'))
            if (map_state.upperLayer == 'map_ls') ls_render(feature.get('_id'))
            found = true;
        }
        //}
    })
    if (!found) {
        document.getElementById('point_render_').innerHTML = ""
    }
    const coordinate = evt.coordinate;
    map_state.crood = ol.proj.toLonLat(coordinate);
    overlay.setPosition(coordinate);
})


setInterval(function() {
    curr.getSource().updateParams({
        'time': Date.now()
    })
}, 600000);


function changeBaseLayer(dom) {
    topo.setVisible(dom.value === 'topo')
    osm.setVisible(dom.value === 'osm')
}



function AddLayer(dom) {

}

function changeUpLayer(dom) {
    map_state.upperLayer = dom.value
    map_us.setVisible(dom.value === 'map_us')
    map_ls.setVisible(dom.value === 'map_ls')
    map_help.setVisible(dom.value === 'user_help')
    perma.setVisible(dom.value === 'perma')
    curr.setVisible(dom.value === 'curr')
}
changeUpLayer({
    value: 'perma'
})
changeBaseLayer({
    value: 'topo'
})