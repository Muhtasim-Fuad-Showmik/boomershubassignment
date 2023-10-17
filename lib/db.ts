"use server";

import mysql from "mysql2/promise";

interface Params {
  query: string;
  values: any;
}

/**
 * Function for execution of queries along with values
 * sent as payload
 *
 * @param query string formatted SQL query to be executed
 * @param values any array of data to be sent along with the query
 * @returns response object found upon execution of the query
 */
export async function query({ query, values = [] }: Params) {
  /**
   * Connect to MySQL database with configurations defined in the
   * local environment
   */
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    /**
     * Fetch results upon execution of the query and return the
     * response object found after closing the db connection
     */
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (err: any) {
    throw Error(err.message);
  }
}
