import { getConnection } from "../database/database.js";

const getParkingPlaces = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM parking_place";
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

const getAvailableParkingPlaces = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_places_available";
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

const getParkingPlacesFree = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_parking_place_free";
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

const createParkingPlace = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    let { code_place } = req.body;
    if (!code_place) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const query = "INSERT INTO parking_place (code_place) VALUES ($1)";
    const values = [code_place];
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

const updateParkingPlace = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { code_place } = req.body;
    const { id } = req.params;
    if (!(code_place && id)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const sentencia = "UPDATE parking_place SET code_place=$1 WHERE id = $2";
    const valores = [code_place, id];
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

const updateParkingPlaceStatus = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { status } = req.body;
    const { id } = req.params;
    if (!(status && id)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    let sentencia = "";
    if (status === "Disponible") {
      sentencia = "UPDATE parking_place SET status='Ocupado' WHERE id = $1";
    } else {
      sentencia = "UPDATE parking_place SET status='Disponible' WHERE id = $1";
    }
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

const deleteParkingPlace = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const query = "DELETE FROM parking_place WHERE id=$1";
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
  getParkingPlaces,
  getAvailableParkingPlaces,
  getParkingPlacesFree,
  createParkingPlace,
  updateParkingPlace,
  deleteParkingPlace,
  updateParkingPlaceStatus,
};
