export class AuthValidator {
  static validateRegister(data) {
    const errors = [];
    const { username, email, password } = data;

    if (!username || username.trim().length === 0) {
      errors.push('Username is required');
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (username.length > 20) {
      errors.push('Username must not exceed 20 characters');
    }

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Invalid email format');
    }

    if (!password || password.length === 0) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateLogin(data) {
    const errors = [];
    const { email, password } = data;

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    }

    if (!password || password.length === 0) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default AuthValidator;
