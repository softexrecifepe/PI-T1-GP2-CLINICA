
const { pool } = require('./database/dbConnection');

//GET
//Rota da API para buscar um tutor e os animais que estão cadastrados no id dele:


//POST
//Rota da API para cadastrar um novo tutor responsável por um animal:


//PUT
//Rota da API para editar os dados de um tutor que é responsável por um animal:
async function updatePetOwnerById (req, res) {
    try {
        const { owners_cpf } = req.params;
        const { owners_name, owners_rg, owners_contact, owners_adress } = req.body;
        const result = await pool.query(
            `UPDATE pet_owners 
            SET owners_name = $1, owners_rg = $2, owners_contact = $3, owners_adress = $4
            WHERE owners_cpf = $5
            RETURNING *`,
            [owners_name, owners_rg, owners_contact, owners_adress, owners_cpf]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Pet owner not found with the specified CPF.' })
        };
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unexpected error occurred while updating pet owner information.' });
    }
};

//DELETE
//Rota da API para deletar um tutor (após deletar o tutor os dados do pet também serão deletados de todas as tabelas):
async function deletePetOwnerById (req, res) {
    try {
        const { owners_cpf } = req.params;     
        const result = await pool.query(
            `DELETE 
            FROM pet_owners 
            WHERE owners_cpf = $1
            RETURNING *`, 
            [owners_cpf]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pet owner not found.' })
        };
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Unexpected error occurred while deleting pet owner.'});
    }
};

module.exports = {
    updatePetOwnerById,
    deletePetOwnerById
};