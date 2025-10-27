const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { Op, fn, col, where } = require('sequelize');
const checkAuth = require('../middleware/checkAuth'); 
const xlsx = require('xlsx');

router.get('/', [checkAuth], async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {}; 

    if (req.query.name) {
      whereClause.long_name = where(
        fn('LOWER', col('long_name')), 
        Op.like,
        `%${req.query.name.toLowerCase()}%` 
      );
    }

    if (req.query.club) {
      whereClause.club_name = where(
        fn('LOWER', col('club_name')), 
        Op.like,
        `%${req.query.club.toLowerCase()}%` 
      );
    }

    
    if (req.query.position) {
      whereClause.player_positions = where(
        fn('LOWER', col('player_positions')), 
        Op.like,
        `%${req.query.position.toLowerCase()}%` 
      );
    }

    const { count, rows } = await Player.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      players: rows
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener jugadores', error: error.message });
  }
});

router.get('/download/csv', [checkAuth], async (req, res) => {
  try {
    const whereClause = {}; 
    if (req.query.name) {
      whereClause.long_name = where(fn('LOWER', col('long_name')), Op.like, `%${req.query.name.toLowerCase()}%`);
    }
    if (req.query.club) {
      whereClause.club_name = where(fn('LOWER', col('club_name')), Op.like, `%${req.query.club.toLowerCase()}%`);
    }
    if (req.query.position) {
      whereClause.player_positions = where(fn('LOWER', col('player_positions')), Op.like, `%${req.query.position.toLowerCase()}%`);
    }

    const players = await Player.findAll({
      where: whereClause
    });

    const plainPlayers = players.map(p => p.get({ plain: true }));

    const ws = xlsx.utils.json_to_sheet(plainPlayers);

    const wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, ws, 'Players');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="jugadores.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);

  } catch (error) {
    res.status(500).json({ message: 'Error al descargar el archivo', error: error.message });
  }
});


router.get('/:id', [checkAuth], async (req, res) => {
  try {
    const { id } = req.params; 
    const player = await Player.findByPk(id, {
      attributes: [
        'id',
        'long_name',
        'club_name',
        'player_positions',
        'overall',
        'nationality_name',
        'pace',
        'shooting',
        'passing',
        'dribbling',
        'defending',
        'physic'
      ]
    });

    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.json(player);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el jugador', error: error.message });
  }
});

router.put('/:id', [checkAuth], async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedData = req.body; 

    delete updatedData.id; 

    const [affectedRows] = await Player.update(updatedData, {
      where: { id: id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Jugador no encontrado o los datos son idénticos' });
    }

    res.json({ message: 'Jugador actualizado exitosamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el jugador', error: error.message });
  }
});

router.post('/', [checkAuth], async (req, res) => {
  try {
    const playerData = req.body; // Todos los datos de tu jugador

    delete playerData.id; 

    const newPlayer = await Player.create(playerData);

    res.status(201).json({
      message: '¡Jugador creado exitosamente!',
      player: newPlayer
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al crear el jugador', error: error.message });
  }
});


module.exports = router;
