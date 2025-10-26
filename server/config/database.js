import mongoose from 'mongoose';
import { AppConfig } from '../core/config/app.config.js';
import { LoggerUtil } from '../common/utils/logger.util.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(AppConfig.database.uri, AppConfig.database.options);
    LoggerUtil.success(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    LoggerUtil.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
