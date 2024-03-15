import { getConnection } from "../database/database.js";
import { comparePassword, encriptyngPassword } from "../config/hash.js";
import { generateTokenWithoutTime } from "../config/jwt.js";

const getUsers = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM users";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al obtener datos de usuarios. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const editProfile = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    let { full_name, pin, oldPin } = req.body;
    console.log(full_name, pin, oldPin);
    const { userId } = req.params;
    if (!(full_name && pin && oldPin && userId)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const queryCheckPin = "SELECT pin FROM users WHERE id = $1";
    const checkPinValues = [userId];
    const checkPin = await connection.query(queryCheckPin, checkPinValues);
    const checkPinHash = checkPin.rows[0].pin;
    const checkPinResult = await comparePassword(oldPin, checkPinHash);
    if (!checkPinResult) {
      return res.status(400).json({
        message: "El pin ingresado no coincide con el pin actual.",
      });
    }
    const hash = await encriptyngPassword(pin);
    const sentencia = "UPDATE users SET full_name=$1, pin=$2 WHERE id = $3";
    const valores = [full_name, hash, userId];
    const resultadoSentencia = await connection.query(sentencia, valores);

    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    const queryCheckId =
      "SELECT id, full_name, email, role FROM users WHERE id = $1";
    const checkIdValues = [userId];

    const respuesta = await connection.query(queryCheckId, checkIdValues);

    const { id, email, role } = respuesta.rows[0];
    full_name = respuesta.rows[0].full_name;

    const userData = {
      id,
      full_name,
      email,
      role,
    };
    const token = generateTokenWithoutTime({ userData });
    const user = { id, full_name, email, role, token };
    return res.status(200).json({
      message: "Información actualizada con éxito.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al actualizar el perfil. Por favor, intenta nuevamente." + error,
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const editProfileNoPassword = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    let { full_name } = req.body;
    const { userId } = req.params;
    if (!(full_name && userId)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const sentencia = "UPDATE users SET full_name=$1 WHERE id = $2";
    const valores = [full_name, userId];

    const resultadoSentencia = await connection.query(sentencia, valores);

    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    const queryCheckId =
      "SELECT id, full_name, email, role FROM users WHERE id = $1";
    const checkIdValues = [userId];

    const respuesta = await connection.query(queryCheckId, checkIdValues);

    const { id, email, role } = respuesta.rows[0];
    full_name = respuesta.rows[0].full_name;

    const userData = {
      id,
      full_name,
      email,
      role,
    };
    const token = generateTokenWithoutTime({ userData });
    const user = { id, full_name, email, role, token };
    return res.status(200).json({
      message: "Información actualizada con éxito.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const updateUser = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { full_name, role, pin } = req.body;
    const { userId } = req.params;
    if (!(full_name && role && pin && userId)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const hash = await encriptyngPassword(pin);
    const sentencia =
      "UPDATE users SET full_name=$1, pin=$2, role=$3 WHERE id = $4";
    const valores = [full_name, hash, role, userId];
    const resultadoSentencia = await connection.query(sentencia, valores);
    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    return res.status(200).json({
      message: "Información actualizada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const updateUserNoPassword = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { full_name, role } = req.body;
    const { userId } = req.params;
    if (!(full_name && role && userId)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const sentencia = "UPDATE users SET full_name=$1, role=$2 WHERE id = $3";
    const valores = [full_name, role, userId];
    const resultadoSentencia = await connection.query(sentencia, valores);

    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    return res.status(200).json({
      message: "Información actualizada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const deleteUser = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const query = "DELETE FROM users WHERE id=$1";
    const values = [userId];
    const response = await connection.query(query, values);
    if (response.length === 0) {
      return res.status(400).json({
        message: "Error al eliminar el usuario. Por favor, intenta nuevamente.",
      });
    }
    return res.status(200).json({
      message: "Usuario eliminado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el usuario. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export {
  getUsers,
  editProfile,
  editProfileNoPassword,
  updateUser,
  updateUserNoPassword,
  deleteUser,
};
