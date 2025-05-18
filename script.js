 // Configuración inicial del mapa
        const map = L.map('map', {
            minZoom: 1,
            maxZoom: 10,
            zoomDelta: 0.5,
            crs: L.CRS.Simple
        }).setView([96, 128], 1.5);
        
        // Dimensiones de la imagen del mapa
        const mapBounds = [[0, 0], [192, 256]];
        
        // Añadir la imagen del mapa
        L.imageOverlay('map-ezaros-world-region.png', mapBounds).addTo(map);
        
        // Establecer los límites del mapa
        map.setMaxBounds(mapBounds);
        
        // Añadir marcadores (ejemplo con Oracle)
        // Necesitarías tener un archivo con la información de los marcadores
        // Por ejemplo:
        /*
        const oracleMarker = L.marker([y, x]).addTo(map);
        oracleMarker.bindPopup("Oracle");
        */
        
        // Opcional: Añadir escala en millas
        L.control.scale({
            imperial: true,
            metric: false
        }).addTo(map);
