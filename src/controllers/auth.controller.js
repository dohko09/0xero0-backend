import dotenv from "dotenv";
dotenv.config();
import { getConnection } from "../database/database.js";
import { transporter } from "../config/mailer.js";
import {
  encriptyngPassword,
  comparePassword,
  generateNewPassword,
} from "../config/hash.js";
import { generateTokenWithoutTime } from "../config/jwt.js";

const register = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { full_name, email, pin, code_register } = req.body;
    if (!(full_name && email && pin && code_register)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    if (code_register !== process.env.CODE_REGISTER) {
      return res.status(400).json({
        message: "Código de registro incorrecto.",
      });
    }
    // Verificar si el correo ya existe en la base de datos
    const queryCheckEmail = "SELECT email FROM users WHERE email = $1";
    const checkEmailValues = [email];
    const result = await connection.query(queryCheckEmail, checkEmailValues);
    if (result.length > 0) {
      return res.status(400).json({
        message: "El correo ya está registrado a una cuenta.",
      });
    }

    const hash = await encriptyngPassword(pin);

    const query =
      "INSERT INTO users (full_name, email, pin) VALUES($1, $2, $3)";
    const values = [full_name, email, hash];

    const response = await connection.query(query, values);

    if (response.length === 0) {
      return res.status(400).json({
        message:
          "Error al registrar el usuario. Por favor, intenta nuevamente.",
      });
    }
    /*return res.status(200).json({
          message:
            "Usuario registrado exitosamente.",
        });*/
    const mailOptions = {
      from: "Estacionamiento 0XERO0 <codementor.dev@gmail.com>",
      to: email,
      subject: "Registro de cuenta",
      html: `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; text-align: center;">
        <h1 style="color: #333;">¡Bienvenido a la familia de Estacionamiento 0XERO0, ${full_name}!</h1>
        <p style="color: #666; font-style: italic;">Este mensaje fue generado automáticamente. Por favor, no responder.</p>
      </div>
      `,
    };

    transporter.sendMail(mailOptions, (mailError, info) => {
      if (mailError) {
        return res.status(500).json({
          message:
            "Error al enviar el aviso de registro. Por favor, intenta nuevamente.",
        });
      } else {
        return res.status(200).json({
          message: "Usuario registrado exitosamente.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al registrar el usuario xd. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const login = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { email, pin } = req.body;

    if (!(email && pin)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    // Verificar si el correo existe en la base de datos
    const queryCheckEmail = "SELECT * FROM users WHERE email = $1";
    const checkEmailValues = [email];
    const respuesta = await connection.query(queryCheckEmail, checkEmailValues);

    if (respuesta.length === 0) {
      return res.status(404).json({
        message:
          "No existe el correo proporcionado. Por favor, intenta nuevamente.",
      });
    }
    if (respuesta.rows[0].status === 0) {
      return res.status(400).json({
        message: "Tu cuenta ha sido deshabilitada.",
      });
    }

    const respuestaComparacion = await comparePassword(
      pin,
      respuesta.rows[0].pin
    );
    if (respuestaComparacion) {
      const { id, full_name, email, role } = respuesta.rows[0];

      const userData = {
        id,
        full_name,
        email,
        role,
      };

      const token = generateTokenWithoutTime({ userData });

      const user = { id, full_name, email, role, token };

      return res.status(200).json({
        message: `Bienvenido ${full_name}`,
        user,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Inicio de sesion fallido, contraseña no valida" });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Verifique que las credenciales sean correctas. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

const resetPassword = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { email } = req.body;
    if (email === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const query = "SELECT email FROM users WHERE email = $1";
    const values = [email];
    const respuesta = await connection.query(query, values);

    if (respuesta.length === 0) {
      return res.status(404).json({
        message:
          "No existe el correo proporcionado. Por favor, intenta nuevamente.",
      });
    }

    const newPassword = await generateNewPassword();
    const hash = await encriptyngPassword(newPassword);

    const updateQuery = "UPDATE users SET pin = $1 WHERE email = $2";
    const updateValues = [hash, email];

    const resultado = await connection.query(updateQuery, updateValues);

    if (resultado.length === 0) {
      return res.status(400).json({
        message:
          "Error al reestablecer la contraseña. Por favor, intenta nuevamente.",
      });
    }
    const mailOptions = {
      from: "Estacionamiento 0XERO0 <codementor.dev@gmail.com>",
      to: email,
      subject: "Restablecimiento de contraseña",
      html: `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; text-align: center;">
      <h1 style="color: #333; font-family: Arial, sans-serif;">Restablecimiento de contraseña</h1>
      <p style="color: #333; font-family: Arial, sans-serif;">Por favor, utiliza la siguiente contraseña para ingresar a tu cuenta:</p>
      <p style="color: #333; font-family: Arial, sans-serif;">${newPassword}</p>
      <p style="color: #666; font-style: italic; font-family: Arial, sans-serif;">Este mensaje fue generado automáticamente. Por favor, no responder.</p>
      </div>
      `,
    };

    transporter.sendMail(mailOptions, (mailError, info) => {
      if (mailError) {
        return res.status(500).json({
          message:
            "Error al enviar el correo electrónico de restablecimiento de contraseña. Por favor, intenta nuevamente.",
        });
      } else {
        return res.status(200).json({
          message:
            "Restablecimiento de contraseña exitoso. Por favor, verifica tu correo electrónico.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al actualizar la contraseña. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.release(); // Cierra la conexión en el bloque finally
    }
  }
};

export { register, login, resetPassword };
