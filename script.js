document.addEventListener('DOMContentLoaded', function () {
    // --- Manejo de la información de las áreas clickeables ---
    const infoDivs = document.querySelectorAll('#info > div');
    const areas = document.querySelectorAll('area');
    const tabs = document.querySelectorAll('.tab');
    const mapContainers = document.querySelectorAll('.map-container');

    function hideAllInfo() {
        infoDivs.forEach(div => div.style.display = 'none');
    }

    function showInfo(type, title) {
        hideAllInfo();
        const selectedDiv = document.getElementById('info-' + type);
        if (selectedDiv) {
            selectedDiv.style.display = 'block';
            const h2 = selectedDiv.querySelector('.infmap h2');
            if (h2) {
                h2.textContent = title;
            }
        }
    }

    areas.forEach(area => {
        area.addEventListener('click', (event) => {
            event.preventDefault();
            const type = area.dataset.type;
            const title = area.title;
            showInfo(type, title);
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const mapId = tab.dataset.map;
            mapContainers.forEach(container => {
                container.classList.remove('active');
            });
            document.getElementById(mapId).classList.add('active');
        });
    });

    // Ocultar toda la información inicialmente
    hideAllInfo();

    // --- Funcionalidad de zoom y desplazamiento ---
    const mapa = document.getElementById('mapa');
    const container = mapa.parentElement; // El contenedor del mapa
    let zoomLevel = 1;
    const maxZoom = 3; // Nivel máximo de zoom
    const minZoom = 1;
    let isZoomed = false; // Para controlar si está en zoom o no
    let isDragging = false;
    let startX, startY;
    let offsetX = 0;
    let offsetY = 0;

    // Establecer las dimensiones fijas del mapa en 600px de ancho
    const mapaWidth = 600;
    mapa.style.width = `${mapaWidth}px`;

    const mapaHeight = mapa.clientHeight; // Mantener el alto original de la imagen

    // Evento de clic para hacer zoom o quitar el zoom
    mapa.addEventListener('click', function (event) {
        // Solo hacer zoom si el clic no es en un área clickeable
        const target = event.target.closest('area');
        if (target) return; // No hacer zoom si se clickeó en un área

        const rect = mapa.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Alternar entre zoom y deszoom
        if (isZoomed) {
            // Si ya está en zoom, quitar el zoom
            zoomLevel = minZoom;
            offsetX = 0;
            offsetY = 0;
            mapa.style.transform = `scale(${zoomLevel})`;
            mapa.style.left = `${offsetX}px`;
            mapa.style.top = `${offsetY}px`;
            isZoomed = false; // Se ha quitado el zoom
            mapa.style.cursor = 'default'; // Restablece el cursor
        } else {
            // Si no está en zoom, hacer zoom
            zoomLevel = maxZoom;
            isZoomed = true;
            // Calcula el nuevo origen del zoom
            const centerX = clickX / rect.width * 100;
            const centerY = clickY / rect.height * 100;

            // Aplica el zoom
            mapa.style.transform = `scale(${zoomLevel})`;
            mapa.style.transformOrigin = `${centerX}% ${centerY}%`;
            mapa.style.cursor = 'grab'; // Cambia el cursor para el desplazamiento
        }
    });

    // Evento para seguir el cursor cuando esté en zoom
    mapa.addEventListener('mousemove', function (e) {
        if (!isZoomed) return; // Solo mover el mapa si está en zoom

        // No permitir mover el mapa si no se ha hecho clic
        if (!isDragging) return;

        e.preventDefault();

        // Calcula el desplazamiento basado en el movimiento del ratón
        const dx = (e.pageX - startX) * (6 / zoomLevel); // Desplazamiento horizontal
        const dy = (e.pageY - startY) * (6 / zoomLevel); // Desplazamiento vertical

        offsetX -= dx; // Ajusta la posición horizontal
        offsetY -= dy; // Ajusta la posición vertical


        // Aplica el nuevo desplazamiento
        mapa.style.left = `${offsetX}px`;
        mapa.style.top = `${offsetY}px`;

        // Actualiza las posiciones iniciales del ratón
        startX = e.pageX;
        startY = e.pageY;
    });

    // Evento para iniciar el desplazamiento cuando está en zoom
    mapa.addEventListener('mousemove', function (e) {
    if (!isZoomed) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Distancia del cursor al centro
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;

    // Sensibilidad del movimiento (ajustable)
    const sensitivity = 0.05;

    offsetX -= dx * sensitivity;
    offsetY -= dy * sensitivity;

    mapa.style.left = `${offsetX}px`;
    mapa.style.top = `${offsetY}px`;
});

    // Detener el desplazamiento
    mapa.addEventListener('mouseup', () => {
        if (isZoomed) {
            isDragging = false;
            mapa.style.cursor = 'grab'; // Cambia el cursor al soltar
        }
    });

    mapa.addEventListener('mouseleave', () => {
        if (isZoomed) {
            isDragging = false;
            mapa.style.cursor = 'grab'; // Cambia el cursor al salir del área del mapa
        }
    });
});