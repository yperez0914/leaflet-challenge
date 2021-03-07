
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
     // Perform a GET request to the query URL
     d3.json(queryUrl, function(data) {
      // Once we get a response, send the data.features object to the createFeatures function
      createFeatures(data.features);
      console.log(data.features);
  });
    function createMap(earthquakes) {

        // Define streetmap and darkmap layers
        var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
          tileSize: 512,
          maxZoom: 15,
          zoomOffset: -1,
          id: "mapbox/streets-v11",
          accessToken: API_KEY
        });
      
        var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 15,
          id: "dark-v10",
          accessToken: API_KEY
        });
      
        // Define a baseMaps object to hold our base layers
        var baseMaps = {
          "Street Map": streetmap,
          "Dark Map": darkmap
        };
      
        // Create overlay object to hold our overlay layer
        var overlayMaps = {
          Earthquakes: earthquakes
        };
      
        // Create our map, giving it the streetmap and earthquakes layers to display on load
        var myMap = L.map("map", {
          center: [
            37.09, -95.71
          ],
          zoom: 3,
          layers: [streetmap, earthquakes]
        });
      
        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);
    }
    function createFeatures(earthquakeData) {
  
        function colorSel(depth){
          if (depth <10) {
          return "#c4ff4d";
          }
          else if (depth<30) {
          return  "#ffff66";
          }
          else if (depth < 50) {
          return  "#ffcc66";
          }
          else if (depth < 70) {
          return "#ffa64d";
          }
          else if (depth < 90) {
          return  "#e67300";
          }
          else {
          return  "#ff4d4d";
          }
        }
     
      
      function markerSize(magnitude) {
              return magnitude *3;
      }
      
      function quakeMarker(feature) {
        return{
        stroke: false,
        fillOpacity: 0.75,
        fillColor: colorSel(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag)
        };
      }
    var earthquakes = L.geoJSON(earthquakeData, {
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
            },
      style: quakeMarker,
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
        );
      }
    });
    // .addTo(map);
   
          // Sending our earthquakes layer to the createMap function
          createMap(earthquakes);
    };
    
