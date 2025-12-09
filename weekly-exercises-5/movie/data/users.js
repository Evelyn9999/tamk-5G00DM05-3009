import bcrypt from "bcrypt";

export const users = [];

let nextUserId = 1;
export const getNextUserId = () => nextUserId++;
