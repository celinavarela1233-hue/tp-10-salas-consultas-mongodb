# tp-10-salas-consultas-mongodb

## Instalacion
- Se crea el repositorio en gitHub, se clona el respositorio y se lo ubica en la carpeta

## archivo .env.example
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u10?retryWrites=true&w=majority

# Comprobacion y ejecucion
- comprobar formato y linting: npm run check

- comprobar la conexion a la base de datos: node --env-file=.env scripts/comprobar-conexion.js

- iniciar el servidor: node --env-file=.env src/index.js

- el servidor esta disponible en http://localhost:3000

## contrato de la API (GET /api/reservas)
- sala, tipo String, filtra por coincidencia exacta
- orden, tipo String, opciones admitidas: estudiante, personas-asc, personas-desc
- pagina, tipo Number, numero de pagina entre 1 y 100 (por defecto es 1)
- limite, tipo Number, cantidad de elementos por pagina entre 1 y 20 (por defecto es 2)

EJEMPLO DE RESPUESTA EXITOSA
{
  "datos": [
    {
      "id": "6aed1dbe5e0a4c0324ca3788",
      "estudiante": "Ana Ejemplo",
      "email": "ana@example.com",
      "sala": "Sala Norte",
      "fecha": "2026-10-28",
      "turno": "Mañana",
      "personas": 2,
      "estado": "pendiente"
    },
    {
      "id": "6aed1e415e0a4c0324ca3790",
      "estudiante": "Bruno Ejemplo",
      "email": "bruno@example.com",
      "sala": "Sala Norte",
      "fecha": "2026-09-20",
      "turno": "Tarde",
      "personas": 1,
      "estado": "pendiente"
    }
  ],
  "pagina": 1,
  "limite": 2,
  "total": 6,
  "paginas": 3
}

## Solicitudes reproducibles de Postman
- URL: http://localhost:3000/api/reservas

- 200 OK, con un arreglo de 2 registros, pagina 1, limite 2, total 6, paginas 3

- Params: sala=Sala Norte, orden=personas-asc, pagina=1, limite=2,
200 OK, devolviendo las reservas ordenadas ascendentemente por cantidad de personas



## Respuesta
¿Qué datos describirían una
sala y cuáles describen una reserva? 
una sala estaria descrita por atributos como su nombre, capacidad macima y equipamiento tecnico, mientras que una reserva se define por el estudiante, el mail, la fecha, el turno, la cantidad de personas y el estado.

¿Por qué tendría sentido considerar una referencia o datos embebidos?
tendria sentido utilizar datos embebidos si los detalles de la sala son estaticos y pertenecen exclusivamente al ambito de cada reserva. Por el contrario, resultaria mas adecuado optar por una referencia si la información de la sala es centralizada, independiente y compartida por múltiples reservas concurrentes.
