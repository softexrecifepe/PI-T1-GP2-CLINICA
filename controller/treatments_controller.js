
const { pool } = require('./database/dbConnection');

//GET
//Rota da API para buscar quais os tratamentos(medicações) que cada animal está tomando:

//POST
//Rota da API para cadastrar um tratamento para um animal que está internado:

//PUT
// Rota da API para editar os dados de tratamento de um animal da clínica:
async function updateTreatmentById (req, res) {
    try {
        const { treatment_id } = req.params;
        const { medication_name, medication_period, medication_dosage, medication_interval, medication_check,
            administration_route, treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF } = req.body;
        const result = await pool.query(
            `UPDATE treatments
            SET medication_name = $1, medication_period = $2, medication_dosage = $3,
                medication_interval = $4, medication_check = $5, administration_route = $6, treatment_observations = $7,
                hospitalization_id = $8, veterinarian_CPF = $9, nurse_CPF = $10
            WHERE treatment_id = $11
            RETURNING *`,
            [medication_name, medication_period, medication_dosage, medication_interval, medication_check,
                administration_route, treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF, treatment_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Treatment not found with specified ID.'});
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Unexpected error occurred while updating treatment information.'});
    }
};

module.exports = {
    updateTreatmentById
};