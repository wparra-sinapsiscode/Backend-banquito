const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      const result = await authService.login(username, password);
      
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const userData = req.body;
      
      const user = await authService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      const result = await authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        message: 'Token renovado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updateData = req.body;
      const userId = req.user.id;
      
      const user = await authService.updateProfile(userId, updateData);
      
      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      
      const user = await authService.getUserById(userId);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // En una implementación real, aquí podrías invalidar el token
      // Por ahora, simplemente respondemos exitosamente
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();