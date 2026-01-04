import argon2 from "argon2";
import type { QueryResult } from "pg";
import { query } from "../db/query";

export const createAccessToken = (emailAddress: string) => {
  return {
    sub: emailAddress,
  };
};

export const checkUserLogin = async (
  emailAddress: string,
  password: string,
): Promise<boolean> => {
  const userQuery = await query(
    `SELECT password FROM users WHERE email_address = $1`,
    [emailAddress],
  );

  if (userQuery.rowCount !== 1) {
    throw new Error("No user found with that email address");
  }

  const passwordVerification = await argon2.verify(
    userQuery.rows[0].password,
    password,
  );

  return passwordVerification;
};

export const createUser = async (user: {
  firstName: string;
  lastName: string;
  password: string;
  emailAddress: string;
}): Promise<QueryResult<any>> => {
  const encryptedPassword = await argon2.hash(user.password);

  const res = await query(
    `
          INSERT INTO users(number, first_name, last_name, password, email_address)
          SELECT floor(random() * 9999) as "number", $1 as "first_name", $2 as "last_name", $3 as "password", $4 as "email_address"
          RETURNING *`,
    [user.firstName, user.lastName, encryptedPassword, user.emailAddress],
  );

  return res;
};
