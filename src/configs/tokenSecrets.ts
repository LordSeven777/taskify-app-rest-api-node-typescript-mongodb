interface TokenSecretsConfig {
  access: string;
  refresh: string;
}

export const development: TokenSecretsConfig = {
  access: process.env.ACCESS_TOKEN_SECRET_KEY || "access-secret",
  refresh: process.env.REFRESH_TOKEN_SECRET_KEY || "refresh-secret",
};

export const production: TokenSecretsConfig = {
  access: process.env.ACCESS_TOKEN_SECRET_KEY as string,
  refresh: process.env.REFRESH_TOKEN_SECRET_KEY as string,
};
