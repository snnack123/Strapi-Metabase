module.exports = ({ env }) => ({
  connection: {
    client: "mysql",
    connection: {
      host: env(
        "DATABASE_HOST",
        "ucb-development.cthliwyojsly.eu-central-1.rds.amazonaws.com"
      ),
      port: env.int("DATABASE_PORT", 3306),
      database: env("DATABASE_NAME", "demo_strapi2"),
      user: env("DATABASE_USERNAME", "admin"),
      password: env(
        "DATABASE_PASSWORD",
        "jnk73nhrM2ZR8qgk42nEggpX5GVbyK8w3Xqd2zZ"
      ),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
