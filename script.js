 document.addEventListener('DOMContentLoaded', function () {
            // --- Configuración estilo Leaflet ---
            const mapConfig = {
                imageSize: [600, 0], // Se calculará automáticamente
                bounds: {
                    min: [0, 0],
                    max: [600, 0] // Se calculará automáticamente
                },
                defaultZoom: 1,
                minZoom: 1,
                maxZoom: 4,
                zoomDelta: 0.5,
                initialCenter: [300, 300] // Centro inicial [x, y]
            };

            // --- Elementos del DOM ---
            const mapa = document.getElementById('mapa');
            const container = mapa.parentElement;
            const zoomInBtn = document.getElementById('zoom-in');
            const zoomOutBtn = document.getElementById('zoom-out');
            const resetBtn = document.getElementById('reset-btn');

            // --- Variables de estado ---
            let zoomLevel = mapConfig.defaultZoom;
            let isDragging = false;
            let startX, startY;
            let offsetX = 0;
            let offsetY = 0;

            // --- Inicialización ---
            function initMap() {
                // Calcular dimensiones reales de la imagen
                mapConfig.imageSize = [mapa.width, mapa.height];
                mapConfig.bounds.max = [mapa.width, mapa.height];
                
                // Configurar centro inicial si no está definido
                if (!mapConfig.initialCenter) {
                    mapConfig.initialCenter = [mapa.width / 2, mapa.height / 2];
                }
                
                // Centrar el mapa inicialmente
                const [centerX, centerY] = mapConfig.initialCenter;
                offsetX = (container.clientWidth / 2) - (centerX * mapConfig.defaultZoom);
                offsetY = (container.clientHeight / 2) - (centerY * mapConfig.defaultZoom);
                
                applyTransform();
            }

            // --- Funciones principales ---
            function limitOffset() {
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                const [imgWidth, imgHeight] = mapConfig.imageSize;
                
                const scaledWidth = imgWidth * zoomLevel;
                const scaledHeight = imgHeight * zoomLevel;
                
                const maxOffsetX = Math.max(0, (scaledWidth - containerWidth) / 2);
                const maxOffsetY = Math.max(0, (scaledHeight - containerHeight) / 2);
                
                offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
                offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
            }

            function applyTransform() {
                limitOffset();
                mapa.style.transform = `scale(${zoomLevel})`;
                mapa.style.left = `${offsetX}px`;
                mapa.style.top = `${offsetY}px`;
            }

            function setZoom(newZoom, centerX, centerY) {
                const oldZoom = zoomLevel;
                zoomLevel = Math.max(mapConfig.minZoom, Math.min(mapConfig.maxZoom, newZoom));
                
                // Si se especifica un centro, ajustar el offset para mantenerlo en la misma posición
                if (centerX !== undefined && centerY !== undefined) {
                    const containerRect = container.getBoundingClientRect();
                    const mouseX = centerX - containerRect.left;
                    const mouseY = centerY - containerRect.top;
                    
                    offsetX = mouseX - (mouseX - offsetX) * (zoomLevel / oldZoom);
                    offsetY = mouseY - (mouseY - offsetY) * (zoomLevel / oldZoom);
                    
                    mapa.style.transformOrigin = `${mouseX - offsetX}px ${mouseY - offsetY}px`;
                }
                
                applyTransform();
                updateCursor();
            }

            function updateCursor() {
                mapa.style.cursor = zoomLevel > mapConfig.defaultZoom ? 'grab' : 'default';
            }

            // --- Eventos ---
            // Zoom con rueda del mouse
            container.addEventListener('wheel', function(e) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? mapConfig.zoomDelta : -mapConfig.zoomDelta;
                const rect = container.getBoundingClientRect();
                const centerX = e.clientX - rect.left;
                const centerY = e.clientY - rect.top;
                setZoom(zoomLevel + delta, centerX, centerY);
            });

            // Zoom con botones
            zoomInBtn.addEventListener('click', () => setZoom(zoomLevel + mapConfig.zoomDelta));
            zoomOutBtn.addEventListener('click', () => setZoom(zoomLevel - mapConfig.zoomDelta));
            resetBtn.addEventListener('click', () => {
                zoomLevel = mapConfig.defaultZoom;
                const [centerX, centerY] = mapConfig.initialCenter;
                offsetX = (container.clientWidth / 2) - (centerX * mapConfig.defaultZoom);
                offsetY = (container.clientHeight / 2) - (centerY * mapConfig.defaultZoom);
                applyTransform();
            });

            // Arrastre del mapa
            mapa.addEventListener('mousedown', function(e) {
                if (zoomLevel <= mapConfig.defaultZoom) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                mapa.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', function(e) {
                if (!isDragging || zoomLevel <= mapConfig.defaultZoom) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                offsetX += dx;
                offsetY += dy;
                
                startX = e.clientX;
                startY = e.clientY;
                
                applyTransform();
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
                updateCursor();
            });

            // Doble clic para zoom
            mapa.addEventListener('dblclick', function(e) {
                e.preventDefault();
                const rect = container.getBoundingClientRect();
                const centerX = e.clientX - rect.left;
                const centerY = e.clientY - rect.top;
                
                if (zoomLevel > mapConfig.defaultZoom) {
                    setZoom(mapConfig.defaultZoom);
                } else {
                    setZoom(mapConfig.maxZoom, centerX, centerY);
                }
            });

            // Inicializar el mapa cuando la imagen cargue
            mapa.onload = initMap;
            if (mapa.complete) initMap();
        });
