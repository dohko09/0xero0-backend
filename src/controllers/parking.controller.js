import { getConnection } from "../database/database.js";

const getParking = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM parking";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener datos",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const getParkingView = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();
    const query = "SELECT * FROM sp_parking_view($1)";
    const data = await connection.query(query, [id]);
    if (data.length === 0) {
      return res.status(400).json({
        message: "No se encontraron datos",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener datos",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const createParking = async (req, res) => {
  let connection;
  try {
    const { owner, car_plate, parking_place_id, entry_time } = req.body;
    if (!(owner && car_plate && parking_place_id && entry_time)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    connection = await getConnection();
    const query = "SELECT*FROM sp_insert_parking($1,$2,$3,$4)";
    const values = [owner, car_plate, parking_place_id, entry_time];
    const result = await connection.query(query, values);

    if (result.length === 0) {
      return res.status(400).json({
        message: "Error al insertar.",
      });
    }
    return res.status(200).json({
      message: "Registro creado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al insertar.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const updateParking = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    connection = await getConnection();

    const sentencia = "SELECT*FROM sp_parking_close($1)";
    const valores = [id];
    const resultadoSentencia = await connection.query(sentencia, valores);
    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información.",
      });
    }
    return res.status(200).json({
      message: "Información actualizada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const deleteParking = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const query = "DELETE FROM parking WHERE id=$1";
    const values = [id];
    const response = await connection.query(query, values);
    if (response.length === 0) {
      return res.status(400).json({
        message: "Error al eliminar.",
      });
    }
    return res.status(200).json({
      message: "Eliminado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export {
  getParking,
  getParkingView,
  createParking,
  updateParking,
  deleteParking,
};
