import 'dotenv/config';
const config = {
  // Connection URL from environment
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;
