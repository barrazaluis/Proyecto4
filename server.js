const express = require('express');
const reservasRoutes = require('./routes/reservas.routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');


const swaggerDocument = YAML.load('./docs/swagger.json');

require('dotenv').config();

const app = express();
app.use(express.json());


app.use('/api/reservas', reservasRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servicio corriendo en http://localhost:${PORT}`));