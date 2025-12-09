import bcrypt from "bcrypt";

export const users = [
    {
        id: 1,
        username: "admin",
        passwordHash: bcrypt.hashSync("admin123", 10),
        role: "admin"
    },
    {
        id: 2,
        username: "john",
        passwordHash: bcrypt.hashSync("user123", 10),
        role: "user"
    }
];
