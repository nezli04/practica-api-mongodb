const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    carrera: {
      type: String,
      required: true,
      trim: true
    },
    semestre: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Alumno', alumnoSchema);