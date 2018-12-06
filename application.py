from flask import Flask, render_template, jsonify, request
from database import DatabasePort
from psycopg2.extras import DictCursor
import json
from itertools import chain
from mapbox import Geocoder


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/county')
def loadCounty():
    rows = executeQuery("lake_county")
    return jsonify(rows)


@app.route('/hospitals')
def loadHospitals():
    rows = executeQuery("all_hospitals")
    return jsonify(rows)


@app.route('/mortality')
def getMortalityRate():
    rows = executeQuery("get_mortality_rate")
    rates = []
    for area in rows:
        rates.append(area['properties']['description'])
    rates.sort()
    half = (rates[-1] - rates[1]) / 2
    op1 = 0.4
    op2 = 0.7
    for area in rows:
        if area['properties']['description'] == 0:
            area['properties']['fill-opacity'] = 0
        elif area['properties']['description'] <= rates[1] + half:
            area['properties']['fill'] = '#DAA520'
            if area['properties']['description'] <= rates[1] + half/2:
                area['properties']['fill-opacity'] = op1
            else:
                area['properties']['fill-opacity'] = op2
        else:
            area['properties']['fill'] =  '#228B22'
            if area['properties']['description'] < rates[-1] - half/2:
                area['properties']['fill-opacity'] = op1
            else:
                area['properties']['fill-opacity'] = op2
    return jsonify(rows)


@app.route('/stats')
def getStats():
    rows = executeQuery("get_stats")
    return jsonify(rows)


@app.route('/geocode')
def getCoordinates():
    src = request.args.get('src')
    geocoder = Geocoder(access_token='pk.eyJ1Ijoic3VlNDIiLCJhIjoiY2pueXA4dDRpMTg0NzN3a2d2bHZuemhvdiJ9.LuM5aP5vun4FrghZWwd5RA', host='api.mapbox.com',)
    response = geocoder.forward(src)
    result = response.json()['features'][0]
    to_return = {}
    to_return["geometry"] = result["geometry"]
    to_return["type"] = result["type"]
    to_return["properties"] = {"marker-color": "#191970", "marker-size": "medium"}
    geometry = str(to_return).replace("'", '"')
    return geometry


@app.route('/closest')
def getClosest():
    lon = str(request.args.get('lon'))
    lat = str(request.args.get('lat'))
    rows = executeQuery("get_closest", (lon, lat))
    return jsonify(rows)


@app.route('/pin')
def getPin():
    lon = str(request.args.get('lon'))
    lat = str(request.args.get('lat'))
    rows = executeQuery("get_pin_from_coords", (lon, lat))
    return jsonify(rows)


def executeQuery(query_to_execute, params=None):
    dp = DatabasePort()
    with dp.connection_handler(commit=True, cursor_factory=DictCursor) as cursor:
        with open('./static/queries.json') as query_file:
            data = json.load(query_file)
            query = data[query_to_execute]
            if (params):
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            rows = list(chain(*cursor.fetchall()))
    return rows
