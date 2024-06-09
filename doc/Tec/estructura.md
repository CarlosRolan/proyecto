### Estructura del Proyecto

El proyecto se divide en dos partes principales: el cliente y el servidor. Cada una de estas partes tiene su propio conjunto de archivos y funcionalidades específicas.

#### Cliente (`src/client`)

El cliente es responsable de la interfaz de usuario y la experiencia del jugador. Está construido principalmente con JavaScript y utiliza la biblioteca Three.js para renderizar gráficos en 3D en el navegador web.

- **`client.js`**: Punto de entrada principal del cliente. Inicializa la aplicación del juego y configura la interfaz de usuario.

- **`camera.js`**: Contiene la lógica relacionada con la cámara del juego, incluida la función para mover la cámara alrededor del menú.

- **`ground.js`**: Define el suelo del escenario en el juego. Carga una textura y la aplica al suelo tridimensional.

- **`maze.js`**: Genera el laberinto tridimensional utilizando datos generados aleatoriamente o predefinidos. También crea las geometrías y materiales para representar el laberinto en el juego.

- **`menuBackground.js`**: Controla la animación de fondo en el menú del juego.

- **`player.js`**: Define la clase `Player`, que representa al jugador en el juego. Contiene lógica para el movimiento, la rotación y la interacción del jugador.

- **`renderer.js`**: Configura y gestiona el renderizado de la escena tridimensional utilizando Three.js. Exporta la instancia del renderizador para su uso en otros archivos.

- **`star.js`**: Crea una estrella en el juego que rota y rebota continuamente. Define la geometría, el material y el comportamiento de la estrella.

#### Servidor (`src/server`)

El servidor gestiona la lógica del juego, la comunicación con los clientes y el intercambio de datos en tiempo real a través de WebSockets.

- **`server.mjs`**: Punto de entrada principal del servidor. Inicializa un servidor WebSocket utilizando el paquete `ws` y gestiona las conexiones de los clientes.

- **`msg.mjs`**: Define la clase `Msg`, que se utiliza para estandarizar la comunicación entre el cliente y el servidor. También define las constantes para los diferentes tipos de acciones que pueden ocurrir durante el juego.

#### Archivos Compartidos

Algunos archivos son compartidos entre el cliente y el servidor, ya que contienen funcionalidades utilizadas en ambos lados.

- **`three.module.js`**: Biblioteca Three.js utilizada tanto en el cliente como en el servidor para la renderización de gráficos en 3D.

- **`res`**: Carpeta donde se guardan todos los recursos multimedia y graficos entre los que estan :

- **`texture_ground.png`**: Textura utilizada para el suelo del escenario en el juego.

- **`texture_maze.jpg`**: Textura utilizada para las paredes del laberinto en el juego.

Esta estructura de archivos y directorios facilita el desarrollo, el mantenimiento y la colaboración en el proyecto al organizar claramente el código en componentes separados y reutilizables.
