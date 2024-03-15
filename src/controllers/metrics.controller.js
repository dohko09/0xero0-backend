import { getConnection } from "../database/database.js";

const getTotalParkingOccupied = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_parking_place_occupied";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el total de parqueos ocupados.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const getTotalParkingToday = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_parking_today";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los parqueos de hoy.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const getParkingLogsLast7Days = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_parking_last_days";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los parqueos de los últimos 7 días.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

export {
  getTotalParkingOccupied,
  getTotalParkingToday,
  getParkingLogsLast7Days,
};
