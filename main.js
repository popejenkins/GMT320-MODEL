
  //Cesium token
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTViY2E5OS1jOWUyLTRiMjgtOTY0My0xMjJhYmNkMmZhM2MiLCJpZCI6MjQxNzg1LCJpYXQiOjE3Mjc2OTQ4Njd9.Ku5x0fQnn9ZSOWkjT5HcaMP9SyPeKbIYhGRGvUWm1Ng';

  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const viewer = new Cesium.Viewer('cesiumContainer', {
    scene3DOnly: true,
    baseLayerPicker: false,
    infoBox: false,  
    HomeButton: false, 
    timeline: true,
    animation: true,
  });
  
  // Enable lighting for better extrusion visibility
  viewer.scene.globe.enableLighting = true;
  //instantiate a variable to store a list of building entities
  let buildingEntities = [];

  // Store GeoJSON data source and building entities
  Cesium.GeoJsonDataSource.load('artwork.geojson')
  .then(function (artworkDataSource) {
    viewer.dataSources.add(artworkDataSource);
  })
  .catch(function (error) {
    console.log("Error loading artwork:", error);
  });
  // Load and add garden
  Cesium.GeoJsonDataSource.load('garden.geojson',{
    stroke: Cesium.Color.LIGHTGREEN,
    fill: Cesium.Color.LIGHTGREEN.withAlpha(1),
    strokeWidth: 2,
  })
  .then(function (gardenDataSource) {
    viewer.dataSources.add(gardenDataSource);
  })
  .catch(function (error) {
    console.log("Error loading garden:", error);
  });
  //load emergency point and add
  Cesium.GeoJsonDataSource.load('emergency point.geojson',{
    stroke: Cesium.Color.HOTPINK,
    fill: Cesium.Color.PINK,
    markerSize: 22,
    markerColor: Cesium.Color.RED})
  .then(function (emergencyDataSource) {
    viewer.dataSources.add(emergencyDataSource);
  })
  .catch(function (error) {
    console.log("Error loading emergency point:", error);
  });

// Load and add Lawns data source
Cesium.GeoJsonDataSource.load('lawn.geojson',{
  stroke: Cesium.Color.DARKGREEN,
  fill: Cesium.Color.DARKGREEN.withAlpha(1),
  strokeWidth: 2,
})
  .then(function (lawnDataSource) {
    viewer.dataSources.add(lawnDataSource);
  })
  .catch(function (error) {
    console.log("Error loading lawn:", error);
  });

// Load and add ATMs data source
Cesium.GeoJsonDataSource.load('atm.geojson')
  .then(function (atmDataSource) {
    viewer.dataSources.add(atmDataSource);
  })
  .catch(function (error) {
    console.log("Error loading ATMs:", error);
  });

// Load and add Buildings data source, then fly to it
// Load and add Buildings data source, then fly to it
Cesium.GeoJsonDataSource.load('building.geojson', { clampToGround: false })
  .then(function (buildingDataSource) {
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
      
      // Fly to the buildings once they are added
      viewer.flyTo(buildingDataSource, {
        duration: 3 // seconds
      });
      

      // Iterate over each building entity and apply extrusions
      buildingDataSource.entities.values.forEach(entity => {
        if (entity.polygon) {
          const height = entity.properties.height?.getValue() || 0;
          const buildingId = entity.properties.building_id?.getValue() || null;

          const additionalHeight = (buildingId === 42) ? 50 : 2.5;  // Increase for Humanities, default for others
          const engheight = (buildingId === 9) ? 30 : 2.5;

          // Apply extrusion and styling
          Object.assign(entity.polygon, {
            extrudedHeight: height + additionalHeight + engheight,
            height: 0,
            material: Cesium.Color.SANDYBROWN,
            outline: true,
            outlineColor: Cesium.Color.BLACK
          });
        }
      });
    } else {
      console.log("No entities found in the buildings data source.");
    }
  })
  .catch(function (error) {
    console.log("Error loading buildings:", error);
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
  
  Cesium.GeoJsonDataSource.load('artwork.geojson')
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
            .filter(name => properties[name].getValue() !== null) // Filter out null values
            .map(name => 
                `<strong>${name}:</strong> ${properties[name].getValue()}<br>`
            ).join('');
    
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
