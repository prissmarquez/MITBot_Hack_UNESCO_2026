# MILBot · UNESCO 2026

Prototipo web educativo para fortalecer habilidades de alfabetización mediática.

## Estructura

- `index.html`: entrada principal del sitio.
- `pages/`: mapa de Infopolis, misiones, resultados y niveles de Quick Check.
- `css/`: estilos separados por página; cada CSS usa el mismo nombre que su HTML.
- `js/`: funcionalidad compartida y lógica de progreso del mapa.

Infopolis guarda en `localStorage` el mejor puntaje de cada misión, desbloquea los niveles en orden y calcula la puntuación total. El botón **Restart game** borra el progreso completo.

El proyecto no requiere compilación: puede abrirse con un servidor estático desde la raíz.
