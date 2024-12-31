import User from '../models/userModel.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { handleResponse, handleError } from '../utils/responseHelper.js';

export const getUser = async (req, res) => {
  try {

    const user_data = {
      "id_user": req.user.id_user,
      "email": req.user.email,
      "name": req.user.name,
      "surname": req.user.surname,
      "file": req.user.file,
      "roles": req.user.roles,
      "created_at": req.user.created_at,
      "updated_at": req.user.updated_at
    };

    handleResponse(res, 200, 'User Detail', user_data);
  } catch (error) {
    handleError(res, error);
  }
};

export const uploadfile = async (req, res) => {
  try {
    const rutaArchivo = "./src/uploads/"; // Ruta completa al archivo que deseas eliminar

    if (req.file == undefined) {
      return handleResponse(res, 400, 'Please upload a file!');
    }

    //Si el usuario tiene foto, se la eliminamos
    if (req.user.file != null) {
      console.log("Ruta:" + rutaArchivo + req.user.file);
      fs.access(rutaArchivo + req.user.file, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('The file does not exist or cannot be accessed');
        } else {
          // Eliminar el archivo
          fs.unlink(rutaArchivo + req.user.file, (err) => {
            if (err) {
              return handleError(res, err);
            }
            console.log('El archivo ha sido eliminado correctamente.');
          });
        }
       
      });
    } else console.log("El usuario no tiene foto, la seteo en la DB");

    //Actualizo la imagen del usuario
    console.log("Guardo la imagen: " + req.file.filename + " en el id de usuario: " + req.user.id_user);
    await User.update({ file: req.file.filename }, { where: { id_user: req.user.id_user } })
    handleResponse(res, 200, "Uploaded the file successfully: " + req.file.originalname);
  } catch (err) {

    if (err.code == "LIMIT_FILE_SIZE") {
      return handleResponse(res, 500, "File size cannot be larger than 2MB!");
    }

    handleError(res, err);
  }
};