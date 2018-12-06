var mapLayerGroup = L.layerGroup();
const url = '/';
var borderLayer;
var pinCoords = [];


function loadCounty() {
    loadData('county', true);
}

function loadHospitals() {
    reset();
    loadData('hospitals', true);
}

function loadNearestHospital() {
    if (document.getElementById("address-from-map").checked) {
        if (pinCoords.length > 0) {
            getHospital(pinCoords);
        }
        else {
            alert("Vyberte miesto na mape!");
        }
        pinCoords = [];
    }
    else {
        var address = document.getElementById("address").value;
        if (address === "") {
            alert('Zadajte adresu!');
            return;
        }
        geoCode(address).then(
            (val) => getHospital(val),
            (err) => alert("Nepodarilo sa získať koordináty.")
        );
    }
}

function getHospital(coords) {
    console.log('coords: ' + coords);
    var params = '?lon=' + coords[0] + '&lat=' + coords[1];
    var req = 'closest' + params;
    loadData(req, false);
}

function loadMortality() {
    loadData('mortality', false);
    var legend = document.getElementsByClassName("legend-div")[0];
    legend.style.opacity = 1;
}

function loadStats() {
    loadData('stats', false);
}

function loadData(urlParam, clear) {
    var request = new XMLHttpRequest();
    request.open('GET', url + urlParam, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            data['type'] = 'FeatureCollection';
            var layer = L.mapbox.featureLayer(data);
            if (clear) {
                mapLayerGroup.clearLayers();
            }
            if (urlParam === "county") {
                borderLayer = layer;
            }
            mapLayerGroup.addLayer(borderLayer);
            mapLayerGroup.addLayer(layer);
            mapLayerGroup.addTo(map);
        }
        else {
            alert(request.status);
        }
    };
    request.onerror = function () {
        alert("Connection Error");
    };

    request.send();
}


function geoCode(search_text) {
    var request = new XMLHttpRequest();
    var params = '?src=' + search_text;
    request.open('GET', url + 'geocode' + params, true);

    return new Promise((resolve, reject) => {
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);               
                var layer = L.mapbox.featureLayer(data);
                mapLayerGroup.clearLayers();
                mapLayerGroup.addLayer(borderLayer);
                mapLayerGroup.addLayer(layer);
                mapLayerGroup.addTo(map);
                resolve(data['geometry']['coordinates']);    
            }
            else {
                alert(request.status);
                reject([]);
            }
        };
        request.onerror = function () {
            alert("Connection Error");
        };

        request.send();
    });
}

function reset() {
    mapLayerGroup.clearLayers();
    mapLayerGroup.addLayer(borderLayer);
    mapLayerGroup.addTo(map);
    document.getElementById("address").value = "";
    document.getElementById("address-from-map").checked = false;
    pinCoords = [];
    var legend = document.getElementsByClassName("legend-div")[0];
    legend.style.opacity = 0;
}


function addPinToCoords(lon, lat) {
    var params = '?lon=' + lon + '&lat=' + lat;
    var req = 'pin' + params;
    loadData(req, true);
    pinCoords = [];
    pinCoords.push(lon);
    pinCoords.push(lat);
}