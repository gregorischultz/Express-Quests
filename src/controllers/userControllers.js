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

module.exports = {
    getUsers,
    getUsersById,
};