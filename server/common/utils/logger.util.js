export class LoggerUtil {
  static info(message, data = null) {
    console.log(`ℹ️  [INFO] ${message}`, data ? data : '');
  }

  static success(message, data = null) {
    console.log(`✅ [SUCCESS] ${message}`, data ? data : '');
  }

  static warn(message, data = null) {
    console.warn(`⚠️  [WARN] ${message}`, data ? data : '');
  }

  static error(message, error = null) {
    console.error(`❌ [ERROR] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 [DEBUG] ${message}`, data ? data : '');
    }
  }
}

export default LoggerUtil;
