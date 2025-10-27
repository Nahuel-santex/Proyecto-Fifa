
const express = require('express');
const cors = require('cors'); 
require('dotenv').config(); 

const sequelize = require('./config/db'); 
const authRoutes = require('./routes/auth'); 
const playerRoutes = require('./routes/players');

const app = express();
const port = 3000;


app.use(cors()); 
app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes); 

app.get('/', (req, res) => {
  res.send('¡El backend de FIFA Manager está funcionando!');
});


app.listen(port, async () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  try {
    await sequelize.sync(); 
    console.log('Base de datos conectada y sincronizada.');
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
  }
});