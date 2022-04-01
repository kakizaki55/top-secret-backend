const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  created_at;
  constructor({ id, title, description, created_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = created_at;
  }

  static async insert({ title, description }) {
    const { rows } = await pool.query(
      `
    INSERT INTO
        secrets (title, description )
    Values
        ($1, $2)
    RETURNING
        *
    `,
      [title, description]
    );
    return new Secret(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT 
        title, description, created_at
      FROM
        secrets
      
      `
    );
    return rows.map((row) => new Secret(row));
  }
};
