const express = require('express');
const reservasRoutes = require('./routes/reservas.routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');


const swaggerDocument = YAML.load('./docs/swagger.json');


require('dotenv').config();