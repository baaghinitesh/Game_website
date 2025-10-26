import { AuthService } from '../services/auth.service.js';
import { AuthValidator } from '../common/validators/auth.validator.js';
import { ResponseUtil } from '../common/utils/response.util.js';
import { LoggerUtil } from '../common/utils/logger.util.js';
import { API_MESSAGES } from '../core/constants/api.constants.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    const validation = AuthValidator.validateRegister({ username, email, password });
    if (!validation.isValid) {
      return ResponseUtil.badRequest(res, 'Validation failed', validation.errors);
    }

    // Register user
    const result = await AuthService.register({ username, email, password });

    return ResponseUtil.created(res, result, API_MESSAGES.REGISTRATION_SUCCESS);
  } catch (error) {
    LoggerUtil.error('Registration error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = AuthValidator.validateLogin({ email, password });
    if (!validation.isValid) {
      return ResponseUtil.badRequest(res, 'Validation failed', validation.errors);
    }

    // Login user
    const result = await AuthService.login({ email, password });

    return ResponseUtil.success(res, result, API_MESSAGES.LOGIN_SUCCESS);
  } catch (error) {
    LoggerUtil.error('Login error:', error);
    return ResponseUtil.unauthorized(res, error.message);
  }
};

export const guestLogin = async (req, res) => {
  try {
    const result = await AuthService.guestLogin();
    return ResponseUtil.created(res, result, 'Guest account created');
  } catch (error) {
    LoggerUtil.error('Guest login error:', error);
    return ResponseUtil.serverError(res, 'Server error creating guest account');
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user._id);
    return ResponseUtil.success(res, { user });
  } catch (error) {
    LoggerUtil.error('Get profile error:', error);
    return ResponseUtil.notFound(res, error.message);
  }
};

export const logout = async (req, res) => {
  try {
    await AuthService.logout(req.user._id);
    return ResponseUtil.success(res, null, API_MESSAGES.LOGOUT_SUCCESS);
  } catch (error) {
    LoggerUtil.error('Logout error:', error);
    return ResponseUtil.serverError(res, 'Server error');
  }
};
