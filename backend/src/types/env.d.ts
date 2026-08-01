declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_DAYS: string;
    FRONTEND_URL: string;
    CORS_ORIGINS?: string;
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
    CONTACT_EMAIL_TO?: string;
    PORT: string;
    API_URL_TICKOMIUM: string;
    API_URL_FORMATE: string;
    API_URL_MDOC: string;
    SERVICE_TOKEN_TICKOMIUM: string;
    SERVICE_TOKEN_FORMATE: string;
    SERVICE_TOKEN_MDOC: string;
    BOOTSTRAP_ADMIN_NAME?: string;
    BOOTSTRAP_ADMIN_EMAIL?: string;
    BOOTSTRAP_ADMIN_PASSWORD?: string;
    NODE_ENV: "development" | "production" | "test" | string;
    COOKIE_DOMAIN?: string;
  }
}
