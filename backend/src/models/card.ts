// src/models/card.ts
import pool from '../db';

export interface Card {
  id: string;
  name: string;
  link: string;
  owner_id: string;
  created_at: Date;
}

export async function createCard(name: string, link: string, ownerId: string) {
  const q = `
    INSERT INTO cards (name, link, owner_id)
    VALUES ($1, $2, $3)
    RETURNING id, name, link, owner_id, created_at
  `;
  const { rows } = await pool.query(q, [name, link, ownerId]);
  return rows[0] as Card;
}

export async function getCardById(id: string) {
  const { rows } = await pool.query(
    `SELECT id, name, link, owner_id, created_at FROM cards WHERE id = $1`,
    [id]
  );
  return (rows[0] as Card) || null;
}

export async function listCards() {
  const { rows } = await pool.query(
    `SELECT id, name, link, owner_id, created_at FROM cards ORDER BY created_at DESC`
  );
  return rows as Card[];
}

export async function deleteCard(id: string, ownerId: string) {
  const { rowCount } = await pool.query(
    `DELETE FROM cards WHERE id = $1 AND owner_id = $2`,
    [id, ownerId]
  );
  return rowCount > 0;
}

export async function likeCard(cardId: string, userId: string) {
  await pool.query(
    `INSERT INTO card_likes (card_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [cardId, userId]
  );
}

export async function unlikeCard(cardId: string, userId: string) {
  await pool.query(
    `DELETE FROM card_likes WHERE card_id = $1 AND user_id = $2`,
    [cardId, userId]
  );
}
