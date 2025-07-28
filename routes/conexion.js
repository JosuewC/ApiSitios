const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../configdb');

router.get('/', (req, res) => {
  res.send('API de empleados funcionando correctamente');
});

router.post('/registrar', async (req, res) => {
  const { Nombre, Cedula, Correo, Contrasena, Rol } = req.body;

  if (!Nombre || !Cedula || !Correo || !Contrasena || !Rol) {
    return res.status(400).json({ success: false, message: 'Faltan datos del empleado' });
  }

  try {
    await poolConnect;

    const verificar = await pool.request()
      .input('Cedula', sql.VarChar, Cedula)
      .query('SELECT * FROM Empleados WHERE Cedula = @Cedula');

    if (verificar.recordset.length > 0) {
      return res.status(409).json({ success: false, message: 'Empleado ya registrado con esa cédula' });
    }

    await pool.request()
      .input('Nombre', sql.VarChar, Nombre)
      .input('Cedula', sql.VarChar, Cedula)
      .input('Correo', sql.VarChar, Correo)
      .input('Contrasena', sql.VarChar, Contrasena)
      .input('Rol', sql.VarChar, Rol)
      .query(`
        INSERT INTO Empleados (Nombre, Cedula, Correo, Contrasena, Rol)
        VALUES (@Nombre, @Cedula, @Correo, @Contrasena, @Rol)
      `);

    return res.status(201).json({ success: true, message: 'Empleado registrado exitosamente' });

  } catch (err) {
    console.error('❌ Error en /registrar:', err);
    return res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
});

router.get('/buscar/:cedula', async (req, res) => {
  const cedula = req.params.cedula;

  try {
    await poolConnect;

    const result = await pool.request()
      .input('Cedula', sql.VarChar, cedula)
      .query('SELECT * FROM Empleados WHERE Cedula = @Cedula');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }

    return res.status(200).json({ success: true, empleado: result.recordset[0] });

  } catch (err) {
    console.error('❌ Error en /buscar:', err);
    return res.status(500).json({ success: false, message: 'Error al buscar empleado' });
  }
});

router.put('/editar/:cedula', async (req, res) => {
  const cedula = req.params.cedula;
  const { Nombre, Correo, Contrasena, Rol } = req.body;

  try {
    await poolConnect;

    const result = await pool.request()
      .input('Nombre', sql.VarChar, Nombre)
      .input('Correo', sql.VarChar, Correo)
      .input('Contrasena', sql.VarChar, Contrasena)
      .input('Rol', sql.VarChar, Rol)
      .input('Cedula', sql.VarChar, cedula)
      .query(`
        UPDATE Empleados
        SET Nombre = @Nombre, Correo = @Correo, Contrasena = @Contrasena, Rol = @Rol
        WHERE Cedula = @Cedula
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado para actualizar' });
    }

    return res.status(200).json({ success: true, message: 'Empleado actualizado correctamente' });

  } catch (err) {
    console.error('❌ Error en /editar:', err);
    return res.status(500).json({ success: false, message: 'Error al actualizar empleado' });
  }
});

router.delete('/eliminar/:cedula', async (req, res) => {
  const cedula = req.params.cedula;

  try {
    await poolConnect;

    const result = await pool.request()
      .input('Cedula', sql.VarChar, cedula)
      .query('DELETE FROM Empleados WHERE Cedula = @Cedula');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado para eliminar' });
    }

    return res.status(200).json({ success: true, message: 'Empleado eliminado exitosamente' });

  } catch (err) {
    console.error('❌ Error en /eliminar:', err);
    return res.status(500).json({ success: false, message: 'Error al eliminar empleado' });
  }
});

module.exports = router;
