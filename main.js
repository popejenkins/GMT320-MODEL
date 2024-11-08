
  //Cesium token
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTViY2E5OS1jOWUyLTRiMjgtOTY0My0xMjJhYmNkMmZhM2MiLCJpZCI6MjQxNzg1LCJpYXQiOjE3Mjc2OTQ4Njd9.Ku5x0fQnn9ZSOWkjT5HcaMP9SyPeKbIYhGRGvUWm1Ng';

  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const viewer = new Cesium.Viewer('cesiumContainer', {
    scene3DOnly: true,
    baseLayerPicker: false,
    infoBox: false,  
    HomeButton: false, 
    timeline: false,
    animation: false,
   
  });
 
  // Enable lighting for better extrusion visibility
  viewer.scene.globe.enableLighting = true;
  // Show buttons based on user selection
 document.getElementById('userType').addEventListener('change', function() {
  const userType = this.value;
  
  // Hide all sections initially
  document.getElementById('controlPanel').style.display = 'none';
  document.getElementById('infoBox').style.display = 'none';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('routeControls').style.display = 'none';
  document.getElementById('academtour').style.display = 'none';
  document.getElementById('Sighttour').style.display = 'none';

  // Show elements based on user type selection
  if (userType === 'resourceManagement') {
    document.getElementById('controlPanel').style.display = 'block';
    document.getElementById('controls').style.display = 'block';
    document.getElementById('routeControls').style.display = 'none';
  } else if (userType === 'student') {
    document.getElementById('routeControls').style.display = 'block';
    document.getElementById('academtour').style.display = 'block';

  }
  else if ( userType === 'visitor') {
    document.getElementById('routeControls').style.display = 'block';
    document.getElementById('Sighttour').style.display = 'block';

  }
  else if (userType === 'prospectiveStudent') {
    document.getElementById('routeControls').style.display = 'block';
    document.getElementById('academtour').style.display = 'block'
    document.getElementById('Sighttour').style.display = 'block';

  }
  // If "other" is selected or the default, keep everything hidden and refresh
  else
  window.location.reload();
});

document.getElementById("academtour").addEventListener("click", function() {
  window.location.href = "index3.html";  // Redirect to index3.html
});

document.getElementById("Sighttour").addEventListener("click", function() {
  window.location.href = "indexSight.html";  // Redirect to index3.html
});
  //instantiate a GLOBAL variable to store a list of building entities
  let buildingEntities = [];
  let buildingDataSource;

 
// Load and add garden
Cesium.GeoJsonDataSource.load('garden.geojson',{
  stroke: Cesium.Color.LIGHTGREEN,
  fill: Cesium.Color.LIGHTGREEN.withAlpha(1),
  strokeWidth: 2,
}).then(function (gardenDataSource) {
  viewer.dataSources.add(gardenDataSource);
  // Apply textures to garden polygons as needed
  var entities = gardenDataSource.entities.values;

  // Iterate through the entities (features) and apply the grass texture
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];

    // Apply the grass texture to the polygon fill
    if (entity.polygon) {
      entity.polygon.material = new Cesium.ImageMaterialProperty({
        image: 'green-leaf-background.jpg',  // Path to your grass texture
        repeat: new Cesium.Cartesian2(10, 10)  // Adjust the repeat as necessary
      });
    }
  }
})
//loading road
Cesium.GeoJsonDataSource.load('Road.geojson',{
  stroke: Cesium.Color.BLACK,
  fill: Cesium.Color.BLACK.withAlpha(1),
  strokeWidth: 4,
}).then(function (RoadDataSource) {
  viewer.dataSources.add(RoadDataSource);
})
//restaurants loading
Cesium.GeoJsonDataSource.load('Restaurant.geojson',{
  markerSize: 30,
  markerColor: Cesium.Color.PURPLE,
  markerSymbol:'restaurant'})
.then(function (restaurantDataSource) {
  viewer.dataSources.add(restaurantDataSource);
})

  //load emergency point and add
  Cesium.GeoJsonDataSource.load('emergency point.geojson',{
    markerSize: 30,
    markerColor: Cesium.Color.GREEN,
    markerSymbol:'hospital'})
  .then(function (emergencyDataSource) {
    viewer.dataSources.add(emergencyDataSource);
  })
  

// Load and add Lawns data source
Cesium.GeoJsonDataSource.load('lawn.geojson', {
  stroke: Cesium.Color.DARKGREEN,  // Retain stroke color if needed
  strokeWidth: 2  // Stroke width for the edges
})
  .then(function (lawnDataSource) {
    viewer.dataSources.add(lawnDataSource);

    var entities = lawnDataSource.entities.values;

    // Iterate through the entities (features) and apply the grass texture
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];

      // Apply the grass texture to the polygon fill
      if (entity.polygon) {
        entity.polygon.material = new Cesium.ImageMaterialProperty({
          image: 'Grass001_1K-JPG_Color.jpg',  // Path to your grass texture
          repeat: new Cesium.Cartesian2(10, 10)  // Adjust the repeat as necessary
        });
      }
    }
  })

// Load and add ATMs data source
Cesium.GeoJsonDataSource.load('atm.geojson',
  {markerSize: 30,
  markerColor: Cesium.Color.GREEN,
  markerSymbol:'bank'})
  .then(function (atmDataSource) {
    viewer.dataSources.add(atmDataSource);
  })

// Load and add Buildings data source, then fly to it
// Load and add Buildings data source, then fly to it


// Function to load the buildings data source
function loadBuildings() {
  Cesium.GeoJsonDataSource.load('Building.geojson', { clampToGround: false })
    .then(function (dataSource) {
      buildingDataSource = dataSource;
      viewer.dataSources.add(buildingDataSource);

      // Populate the buildingEntities array with loaded entities
      buildingEntities = buildingDataSource.entities.values.map(entity => {
        return {
          name: entity.properties.name.getValue(),  // Adjust this to match your property name
          entity: entity
        };
      });

      // Ensure that the data source is correctly loaded and has entities
      if (buildingDataSource && buildingDataSource.entities && buildingDataSource.entities.values.length > 0) {
        viewer.flyTo(buildingDataSource, {
          duration: 1,
          offset: new Cesium.HeadingPitchRange(
              Cesium.Math.toRadians(0),  // Facing the building directly
              Cesium.Math.toRadians(0), // Slight upward tilt for ground-level view
              300 // Move back to 30 meters for a wider view
          )
      });
      
        // Iterate over each building entity and apply extrusions
        buildingDataSource.entities.values.forEach(entity => {
          if (entity.polygon) {
            const height = entity.properties.height?.getValue() || 0;
            const buildingId = entity.properties.building_id?.getValue() || null;

            const additionalHeight = (buildingId === 42) ? 50 : 2.5;
            const engheight = (buildingId === 9) ? 30 : 2.5;

            Object.assign(entity.polygon, {
              extrudedHeight: height + additionalHeight + engheight,
              height: 0,
              material: Cesium.Color.SANDYBROWN,
              outline: true,
              outlineColor: Cesium.Color.BLACK
            });
          }
          populateBuildingDropdowns()
        });
      } else {
        console.log("No entities found in the buildings data source.");
      }
    });
}

// Initial load of buildings
loadBuildings();

// Clear buildings on click
document.getElementById('clearBuildingsBtn').addEventListener('click', function () {
  if (buildingDataSource) {
    viewer.dataSources.remove(buildingDataSource);
    buildingDataSource = null;
  }
});

// Reset buildings on click
document.getElementById('resetBuildingsBtn').addEventListener('click', function () {
  // Reload the current page
  window.location.reload();
});
  
  
  // Set up click event listener to display building info
  viewer.selectedEntityChanged.addEventListener(entity => {
    const infoBox = document.getElementById('infoBox');
  
    // Reset the infoBox content
    infoBox.innerHTML = 'Click on a building to view details';
    
  
    // Check if an entity is selected and if it has properties
    if (Cesium.defined(entity) && Cesium.defined(entity.properties)) {
      const properties = entity.properties;
  
      // Display the infoBox
      infoBox.style.display = 'block';
  
      // Update the infoBox content with building information
      infoBox.innerHTML = '<strong> Item Information:</strong><br>' +
        properties.propertyNames.map(name => 
          `<strong>${name}:</strong> ${properties[name].getValue()}<br>`
        ).join('');
    } else {
      // Hide the infoBox if no building is selected
      infoBox.style.display = 'none';
    }
  });
  
  // Set up search functionality
  document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
  
    // Search for the building by name
    const matchingBuilding = buildingEntities.find(building => 
      building.name.toLowerCase() === searchInput
    );
  
    if (matchingBuilding) {
      // Fly to the building and select it
      viewer.flyTo(matchingBuilding.entity);
      viewer.selectedEntity = matchingBuilding.entity;
    } else {
      alert('Building not found');
    }
  });

 
  
const attributeDropdown = document.getElementById('filterAttribute');
const valueDropdown = document.getElementById('filterValue');

attributeDropdown.addEventListener('change', () => {
  const selectedAttribute = attributeDropdown.value;

  // Clear previous options
  valueDropdown.innerHTML = '<option value="">Select Value</option>';

  // Collect unique values for the selected attribute
  const uniqueValues = new Set();
  buildingEntities.forEach(building => {
    const value = building.entity.properties[selectedAttribute]?.getValue()?.toString().toLowerCase().trim();
    if (value && value !== 'null' && value !== 'null ') {
      uniqueValues.add(value);
    }
  });

  // Populate the value dropdown
  uniqueValues.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    valueDropdown.appendChild(option);
  });
});


// Filter buildings by attribute and value
document.getElementById('filterButton').addEventListener('click', () => {
  const attribute = document.getElementById('filterAttribute').value;
  const value = document.getElementById('filterValue').value.toLowerCase().trim(); // Trim spaces, there was an error with spaces in the geojson thats why some buildings were not highlighted
  console.log(`Filtering by: ${attribute} = ${value}`);

  // Reset all buildings to original color
  buildingEntities.forEach(building => {
      building.entity.polygon.material = Cesium.Color.SANDYBROWN;
  });

  // Filter buildings
  const matches = buildingEntities.filter(building => {
      let propValue = building.entity.properties[attribute]?.getValue()?.toString().toLowerCase().trim();
      console.log(`Checking building: ${building.name}, property value: ${propValue}`);

      if (!propValue && building.entity.properties[attribute]) {
          propValue = building.entity.properties[attribute].toString().toLowerCase().trim();
          console.log(`Fallback property value: ${propValue}`);
      }

      return propValue === value;
  });

  if (matches.length > 0) {
      matches.forEach(building => {
          building.entity.polygon.material = Cesium.Color.GREEN; // Highlight filtered buildings
          console.log(`Highlighting building: ${building.name}`);
      });
  } 
});




  
  Cesium.GeoJsonDataSource.load('artwork.geojson',
    {markerSize: 30,
    markerColor: Cesium.Color.DARKSALMON,
    markerSymbol:'monument'})
  .then(function (dataSource) {
      viewer.dataSources.add(dataSource);
      
      // Iterate over each entity in the GeoJSON file
      var entities = dataSource.entities.values;

      for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];

          // Add a click event handler to display the image from the 'photograph' property
          entity.description = new Cesium.CallbackProperty(function (time, result) {
              var photographPath = entity.properties.photograph.getValue();
          }, false);
      }
  });  
  function speak(text) {
    const synth = window.speechSynthesis;
    
    // Stop any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }
  
  // Event listener for selectedEntityChanged to trigger voice descriptions
  viewer.selectedEntityChanged.addEventListener(entity => {
    const infoBox = document.getElementById('infoBox');
    const synth = window.speechSynthesis;
  
    // Stop speech if no entity is selected
    if (!Cesium.defined(entity) || !Cesium.defined(entity.properties)) {
      synth.cancel(); // Stop any ongoing speech
      infoBox.style.display = 'none'; // Hide the infoBox
      return;
    }
  
    const properties = entity.properties;
    let description = ''; // Prepare the description for TTS
    
  
    // Check if the entity is a building (has building_id property)
    if (properties.building_id) {
      description = properties.description ? properties.description.getValue() : "No description available for this building.";
      
      // Call the speak function to read the description aloud
      speak(description);  
    }
  });
  
  viewer.selectedEntityChanged.addEventListener(entity => {
    const infoBox = document.getElementById('infoBox');
  
    // Check if an entity is selected and if it has properties
    if (Cesium.defined(entity) && Cesium.defined(entity.properties)) {
      const properties = entity.properties;
  
      // Check if the entity is a building (has building_id property)
      if (properties.building_id) {
        // Display building-specific information
        infoBox.style.display = 'block';
    
        // Create a list of property information, filtering out null values
      const propertyInfo = properties.propertyNames
        .filter(name => {
        const value = properties[name].getValue()?.toString().trim().toLowerCase();
        return value !== 'null' && value !== 'null ' && value !== null && value !== undefined;
      })
      .map(name => `<strong>${name}:</strong> ${properties[name].getValue()}<br>`)
      .join('');

    
        // Check if there are any properties to display
        if (propertyInfo) {
            infoBox.innerHTML = '<strong>Building Information:</strong><br>' + propertyInfo;
        } else {
            infoBox.innerHTML = '<strong>Building Information:</strong><br>No additional information available.';
        }
    }
    
      // Check if the entity is an artwork (has photograph property)
      else if (properties.photograph) {
        const photographPath = properties.photograph.getValue();
        const artworkName = properties.name ? properties.name.getValue() : "Artwork";
        
        // Display artwork-specific information
        infoBox.style.display = 'block';
        infoBox.innerHTML = '<strong>Artwork Information:</strong><br>' +
          '<strong>Name:</strong> ' + artworkName + '<br>' +
          '<img src="' + photographPath + '" alt="Artwork Image" width="300">';
      }
    } else {
      // Hide the infoBox if no entity is selected
      infoBox.style.display = 'none';
    }

  
});


// Proximity analysis
// Define global variables
let bufferEntities = [];
const bufferRadiusInput = document.getElementById('bufferRadiusInput');
const showBuffersButton = document.getElementById('showBuffersButton');
const showAffectedBuildingsButton = document.getElementById('showAffectedBuildingsButton');

// Load emergency points data and setup buffers (to be triggered on "Show Buffers" click)
function showBuffers() {
  const bufferRadius = parseFloat(bufferRadiusInput.value) || 0; // Default to 100 if no input
  bufferEntities.forEach(entity => viewer.entities.remove(entity)); // Clear existing buffers
  bufferEntities = []; // Reset bufferEntities array

  Cesium.GeoJsonDataSource.load('emergency point.geojson', {
    markerSize: 30,
    markerColor: Cesium.Color.GREEN,
    markerSymbol: 'hospital'
  }).then(function (emergencyDataSource) {
    viewer.dataSources.add(emergencyDataSource);

    emergencyDataSource.entities.values.forEach((emergencyPoint, index) => {
      const emergencyPosition = emergencyPoint.position.getValue(Cesium.JulianDate.now());

      if (Cesium.defined(emergencyPosition)) {
        // Create a buffer for each emergency point
        const bufferEntity = viewer.entities.add({
          position: emergencyPosition,
          ellipse: {
            semiMajorAxis: bufferRadius,
            semiMinorAxis: bufferRadius,
            material: Cesium.Color.YELLOW.withAlpha(0.2),
          },
        });
        bufferEntities.push(bufferEntity);
      }
    });

    console.log(`Buffers created with radius: ${bufferRadius} meters`);
  }).catch(error => console.error("Failed to load emergency points:", error));
 
}


let buildingsDataSource; // To hold the loaded buildings data source
function showAffectedBuildings() {

  // Clear previous highlights
  if (buildingsDataSource) {
    // Reset the color of all buildings back to their original state
    buildingsDataSource.entities.values.forEach(entity => {
      if (entity.polygon) {
        // Reset to original color (white or your default color)
        entity.polygon.material = Cesium.Color.WHITE.withAlpha(0.5); // Change to your default color if needed
        entity.polygon.extrudedHeight = 0; // Reset extrusion height if needed
      }
    });
  }

  // Load new building data
  Cesium.GeoJsonDataSource.load('building.geojson').then(function (dataSource) {
    // If there's already a data source, remove it
    if (buildingsDataSource) {
      viewer.dataSources.remove(buildingsDataSource);
    }
    
    buildingsDataSource = dataSource; // Store the new data source
    viewer.dataSources.add(buildingsDataSource);

    buildingsDataSource.entities.values.forEach(entity => {
      if (entity.polygon) {
        const height = entity.properties.height?.getValue() || 0;
        const buildingId = entity.properties.building_id?.getValue();

        // Set additional extrusion heights based on specific building IDs
        let additionalHeight = 2.5; // Default additional height for other buildings
        if (buildingId === 42) {
          additionalHeight = 50; // Extra height for Humanities
        } else if (buildingId === 9) {
          additionalHeight = 30; // Extra height for Engineering
        }

        // Get the positions for the building
        const buildingPositions = entity.polygon?.hierarchy?.getValue()?.positions;

        // Determine if the building is affected based on proximity to buffers
        const isAffected = buildingPositions && checkIntersectionWithBuffers(buildingPositions);

        // Apply extrusion and color for affected/unaffected buildings
        Object.assign(entity.polygon, {
          extrudedHeight: height + additionalHeight,
          height: 0,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          material: isAffected ? Cesium.Color.GREEN.withAlpha(1) : Cesium.Color.RED.withAlpha(1)
        });
      }
    });

    console.log("Affected buildings highlighted.");
  }).catch(error => console.error("Failed to load buildings:", error));
}

// Helper function to check intersections
function checkIntersectionWithBuffers(buildingPositions) {
  const buildingBoundingSphere = Cesium.BoundingSphere.fromPoints(buildingPositions);

  for (let buffer of bufferEntities) {
    const emergencyBufferSphere = new Cesium.BoundingSphere(
      buffer.position.getValue(Cesium.JulianDate.now()),
      buffer.ellipse.semiMajorAxis.getValue(Cesium.JulianDate.now())
    );

    const distance = Cesium.Cartesian3.distance(
      emergencyBufferSphere.center,
      buildingBoundingSphere.center
    );
    const sumOfRadii = emergencyBufferSphere.radius + buildingBoundingSphere.radius;

    if (distance <= sumOfRadii) {
      return true; // Intersection found
    }
  }
  return false; // No intersections found
}

// Event listeners for buttons
showBuffersButton.addEventListener('click', showBuffers);
showAffectedBuildingsButton.addEventListener('click', showAffectedBuildings);

// Get reference to UI elements
// Reference to dropdown and button
const startSelect = document.getElementById("startBuilding");
const endSelect = document.getElementById("endBuilding");
const calculateRouteButton = document.getElementById("calculateRoute");


// Populate start and end dropdowns with unique building names
function populateBuildingDropdowns() {
  console.log("Populating building dropdowns...");
  const addedBuildings = new Set(); // To track added building names

  buildingEntities.forEach(({ name }) => {
      // Check if the building name has already been added
      if (!addedBuildings.has(name)) {
          console.log("Adding building to dropdown:", name);

          // Add to dropdown for start
          const optionStart = document.createElement('option');
          optionStart.value = name;
          optionStart.text = name;
          startSelect.add(optionStart);

          // Add to dropdown for end
          const optionEnd = document.createElement('option');
          optionEnd.value = name;
          optionEnd.text = name;
          endSelect.add(optionEnd);

          // Mark the building name as added
          addedBuildings.add(name);
      } else {
          console.log("Building already added, skipping:", name);
      }
  });
}


// Function to get coordinates for a selected building
// Function to get coordinates for a selected building
function getBuildingCoordinates(buildingName) {
  console.log("Getting coordinates for building:", buildingName);
  const building = buildingEntities.find(b => b.name === buildingName);
  
  if (building) {
      const { entity } = building;

      // Check if the entity's polygon is defined
      if (entity && entity.polygon) {
          // Calculate the centroid from the polygon's hierarchy
          const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
          const cartesianArray = positions.map(position => {
              const cartographic = Cesium.Cartographic.fromCartesian(position);
              return {
                  longitude: cartographic.longitude,
                  latitude: cartographic.latitude,
                  height: cartographic.height
              };
          });

          // Calculate the centroid
          const centroid = calculateCentroid(cartesianArray);
          console.log("Calculated centroid position:", centroid);
          return centroid;
      } else {
          console.log("Entity or polygon is undefined for building:", buildingName);
      }
  }
  console.log("Building not found:", buildingName);
  return null;
}

// Function to calculate the centroid from an array of coordinates
function calculateCentroid(coords) {
  const numCoords = coords.length;
  const longitudeSum = coords.reduce((sum, coord) => sum + coord.longitude, 0);
  const latitudeSum = coords.reduce((sum, coord) => sum + coord.latitude, 0);
  const heightSum = coords.reduce((sum, coord) => sum + coord.height, 0);

  return {
      longitude: longitudeSum / numCoords,
      latitude: latitudeSum / numCoords,
      height: heightSum / numCoords // Adjust based on your needs
  };
}

// Draw a line between the start and end points
function drawRoute(startCoordinates, endCoordinates) {
    console.log("Drawing route from", startCoordinates, "to", endCoordinates);
    const positions = [
        Cesium.Cartesian3.fromRadians(startCoordinates.longitude, startCoordinates.latitude, startCoordinates.height),
        Cesium.Cartesian3.fromRadians(endCoordinates.longitude, endCoordinates.latitude, endCoordinates.height)
    ];

    // Add a polyline entity to represent the route
    viewer.entities.add({
        polyline: {
            positions: positions,
            width: 5,
            material: Cesium.Color.RED
        }
    });

    // Fly to the route for a better view
    console.log("Flying to the route...");
    viewer.flyTo(viewer.entities, { duration: 2 });
}

// Event listener for route calculation
calculateRouteButton.addEventListener('click', () => {
    const startBuilding = startSelect.value;
    const endBuilding = endSelect.value;

    console.log("Start building selected:", startBuilding);
    console.log("End building selected:", endBuilding);

    if (startBuilding && endBuilding) {
        const startCoordinates = getBuildingCoordinates(startBuilding);
        const endCoordinates = getBuildingCoordinates(endBuilding);

        if (startCoordinates && endCoordinates) {
            drawRoute(startCoordinates, endCoordinates);
        } else {
            alert('Could not find coordinates for the selected buildings.');
        }
    } else {
        alert('Please select both a start and end building.');
    }
});

// Function to clear the drawn route
function clearRoute() {
  // Remove all polylines (routes) from the viewer
  const entitiesToRemove = viewer.entities.values.filter(entity => entity.polyline);
  entitiesToRemove.forEach(entity => {
      viewer.entities.remove(entity);
  });
  console.log("Cleared all routes from the viewer.");
}

// Event listener for the clear route button
const clearRouteButton = document.getElementById("clearRoute");
clearRouteButton.addEventListener('click', clearRoute);

// Event listener for route calculation
calculateRouteButton.addEventListener('click', () => {
  const startBuilding = startSelect.value;
  const endBuilding = endSelect.value;

  console.log("Start building selected:", startBuilding);
  console.log("End building selected:", endBuilding);

  if (startBuilding && endBuilding) {
      const startCoordinates = getBuildingCoordinates(startBuilding);
      const endCoordinates = getBuildingCoordinates(endBuilding);

      if (startCoordinates && endCoordinates) {
          drawRoute(startCoordinates, endCoordinates);
      } else {
          alert('Could not find coordinates for the selected buildings.');
      }
  } else {
      alert('Please select both a start and end building.');
  }
});


