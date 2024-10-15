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
  
  // Store GeoJSON data source and building entities
  let geoJsonDataSource;
  let buildingEntities = [];
  
  // Load GeoJSON from Cesium Ion asset
  Cesium.IonResource.fromAssetId(2762931).then(resource => {
    return Cesium.GeoJsonDataSource.load(resource, { clampToGround: false });
  }).then(dataSource => {
    geoJsonDataSource = dataSource;
    viewer.dataSources.add(dataSource);
    
    // Set extrusions and zoom to data
    dataSource.entities.values.forEach(entity => {
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
  
        // Store building entities with names
        if (Cesium.defined(entity.properties.name)) {
          buildingEntities.push({
            name: entity.properties.name.getValue(),
            entity: entity
          });
        }
      }
    });
  
    // Zoom to the loaded data source
    viewer.flyTo(dataSource);
  }).catch(error => {
    console.error('Error loading GeoJSON:', error);
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
      infoBox.innerHTML = '<strong>Building Information:</strong><br>' +
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
        infoBox.innerHTML = '<strong>Building Information:</strong><br>' +
          properties.propertyNames.map(name => 
            `<strong>${name}:</strong> ${properties[name].getValue()}<br>`
          ).join('');
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
