export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  
  // เพิ่มฟังก์ชันสำหรับการตรวจสอบสภาพแวดล้อม
  log(...args: any[]) {
    if (!this.isProduction) {
      console.log(...args);
    }
  },
  
  warn(...args: any[]) {
    if (!this.isProduction) {
      console.warn(...args);
    }
  }
};
