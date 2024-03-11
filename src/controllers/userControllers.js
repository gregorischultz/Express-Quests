const database = require ("../../database");

const getUsers = (req, res) => {
    database
    .query ("select * from users")
    .then ((result) => {
        const users = result[0];
        res.status (200).json (users);
    })
    .catch ((err) => {
        console.error (err);
        res.status (500).send ("Internal Server Error");
    });
}

const getUsersById = (req, res) => {
    const usersId = parseInt (req.params.id);

    database
    .query ("select * from users where id = ?", [usersId])
    .then (([users]) => {
        if (users[0] != null) {
            res.status (200).json (users);
        } else {
            res.status (404).send ("User not Found");
        }
    })
    .catch ((err) => {
        console.error (err);
        res.status (500).send ("Internal Server Error");
    });
};

const postUser = (req, res) => {
    const {  firstname, lastname, email, city, language } = req.body;

    database
    .query (
        "INSERT INTO users ( firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
        [ firstname, lastname, email, city, language]
    )
    .then (([result]) => {
        res.status (201).send ({ id: result.insertId });
    })
    .catch ((err) => {
        console.error (err);
        res.sendStatus (500);
    })
};

const updateUser = (req, res) => {
    const id = parseInt (req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database
    .query (
        "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
        [ firstname, lastname, email, city, language, id]
    )
    .then (([result]) => {
        if (result.affectedRows === 0) {
            res.sendStatus (404);
        } else {
            res.sendStatus(204);
        }
    })
    .catch((err) => {
        console.error (err);
        res.sendStatus (500);
    });
};

const deleteUsers = (req, res) => {
    const id = parseInt (req.params.id);

    database 
    .query ("delete from users where id = ?", [id])
    .then (([result]) => {
        if (result.affectedRows === 0) {
            res.sendStatus (404);
        } else {
            res.sendStatus (204);
        }
    })
    .catch ((err) => {
        console.error (err);
        res.sendStatus (500);
    });
};

module.exports = {
    getUsers,
    getUsersById,
    postUser,
    updateUser,
    deleteUsers,
};