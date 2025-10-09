// backend/src/models/user.ts
import pool from '../db';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  about: string;
  avatar: string;
  email: string;
}

export async function createUser(data: {
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}) {
  const hash = await bcrypt.hash(data.password, 10);
  const q = `
    INSERT INTO users (name, about, avatar, email, password)
    VALUES (COALESCE($1,'Жак-Ив Кусто'),
            COALESCE($2,'Исследователь'),
            COALESCE($3,'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
            $4, $5)
    RETURNING id, name, about, avatar, email
  `;
  const { rows } = await pool.query(q, [data.name, data.about, data.avatar, data.email, hash]);
  return rows[0] as User;
}

export async function findUserByEmail(email: string) {
  const { rows } = await pool.query(
    `SELECT id, name, about, avatar, email, password FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

export async function findUserByCredentials(email: string, password: string) {
  const row = await findUserByEmail(email);
  if (!row) throw new Error('UNAUTHORIZED');
  const ok = await bcrypt.compare(password, row.password);
  if (!ok) throw new Error('UNAUTHORIZED');
  const { password: _p, ...safe } = row;
  return safe as User;
}

export async function getUserById(id: string) {
  const { rows } = await pool.query(
    `SELECT id, name, about, avatar, email FROM users WHERE id = $1`,
    [id]
  );
  return (rows[0] as User) || null;
}

export async function updateProfile(id: string, name: string, about: string) {
  const { rows } = await pool.query(
    `UPDATE users SET name = $2, about = $3 WHERE id = $1
     RETURNING id, name, about, avatar, email`,
    [id, name, about]
  );
  return rows[0] as User;
}

export async function updateAvatar(id: string, avatar: string) {
  const { rows } = await pool.query(
    `UPDATE users SET avatar = $2 WHERE id = $1
     RETURNING id, name, about, avatar, email`,
    [id, avatar]
  );
  return rows[0] as User;
}
