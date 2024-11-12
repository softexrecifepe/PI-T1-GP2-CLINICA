
const { pool } = require('./database/dbConnection');

//GET
//Rota da API para buscar todos os animais (internados ou não) da clínica:
async function getAllPets (req, res) {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM pets`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error when consulting registered animals.'})
    }
};

//GET
//Rota da API para buscar um animal específico:
async function getPetById () {}

//POST
//Rota da API para cadastrar um novo animal na clínica:


//PUT
//Rota da API para editar os dados de um animal:
async function updatePetById (req, res) {
    try {
        const { pet_id } = req.params;
        const { pet_name, microchip_code, behavior, species, gender, age, breed, weight, physical_characteristics,
            allergies, diseases } = req.body;
        const result = await pool.query(
            `UPDATE pets
            SET pet_name = $1, microchip_code = $2, behavior = $3, species = $4, gender = $5, age = $6, 
            breed = $7, weight = $8, physical_characteristics = $9, allergies = $10, diseases = $11
            WHERE pet_id = $12
            RETURNING *`,
            [pet_name, microchip_code, behavior, species, gender, age, breed, weight, physical_characteristics,
                allergies, diseases, pet_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Pet not found with the specified ID.'});
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Unexpected error occurred while updating pet information.'});
    }
};

//DELETE
// Rota da API para deletar apenas um pet sem deletar o tutor:
async function deletePetById (req, res) {
    try {
        const { pet_id } = req.params;
        const result = await pool.query(
            `DELETE 
            FROM pets 
            WHERE pet_id = $1
            RETURNING *`, 
            [pet_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pet not found.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Unexpected error occurred while deleting pet.'});
    }
};

module.exports = {
    getAllPets,
    updatePetById,
    deletePetById
};