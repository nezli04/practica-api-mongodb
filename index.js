require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Alumno = require('./models/Alumno');

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors()); 

// Ruta principal
app.get('/', (req, res) => {
  res.status(200).send('API REST con MongoDB funcionando correctamente');
});

// 1. GET: consultar todos los alumnos
app.get('/api/recursos', async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar alumnos' });
  }
});

// 2. GET: consultar un alumno por ID
app.get('/api/recursos/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID no válido' });
    }

    const alumno = await Alumno.findById(req.params.id);

    if (!alumno) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' });
    }

    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar el alumno' });
  }
});

// 3. POST: registrar un alumno
app.post('/api/recursos', async (req, res) => {
  try {
    const { nombre, carrera, semestre } = req.body;

    if (
      typeof nombre !== 'string' || !nombre.trim() ||
      typeof carrera !== 'string' || !carrera.trim() ||
      semestre === undefined || semestre === null ||
      semestre === '' || !Number.isInteger(Number(semestre))
    ) {
      return res.status(400).json({
        mensaje: 'Nombre, carrera y semestre son obligatorios'
      });
    }

    const nuevoAlumno = await Alumno.create({
      nombre,
      carrera,
      semestre: Number(semestre)
    });

    res.status(201).json(nuevoAlumno);
  } catch (error) {
    if (error.name === 'ValidationError' ||
        error.name === 'CastError') {
      return res.status(400).json({
        mensaje: 'Los datos del alumno no son válidos'
      });
    }

    res.status(500).json({ mensaje: 'Error al registrar alumno' });
  }
});

// 4. PUT: actualizar un alumno
app.put('/api/recursos/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID no válido' });
    }

    const { nombre, carrera, semestre } = req.body;

    if (
      typeof nombre !== 'string' || !nombre.trim() ||
      typeof carrera !== 'string' || !carrera.trim() ||
      semestre === undefined || semestre === null ||
      semestre === '' || !Number.isInteger(Number(semestre))
    ) {
      return res.status(400).json({
        mensaje: 'Envía nombre, carrera y semestre válidos'
      });
    }

    const alumnoActualizado = await Alumno.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        carrera,
        semestre: Number(semestre)
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!alumnoActualizado) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' });
    }

    res.status(200).json(alumnoActualizado);
  } catch (error) {
    if (error.name === 'ValidationError' ||
        error.name === 'CastError') {
      return res.status(400).json({
        mensaje: 'Los datos del alumno no son válidos'
      });
    }

    res.status(500).json({ mensaje: 'Error al actualizar alumno' });
  }
});

// 5. DELETE: eliminar un alumno
app.delete('/api/recursos/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID no válido' });
    }

    const alumnoEliminado = await Alumno.findByIdAndDelete(
      req.params.id
    );

    if (!alumnoEliminado) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Alumno eliminado correctamente',
      alumno: alumnoEliminado
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar alumno' });
  }
});

// Conexión a MongoDB e inicio del servidor
async function iniciarServidor() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión a MongoDB establecida');

    app.listen(PORT, () => {
      console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

iniciarServidor();