
const { pool } = require('../database/dbConnection');

//GET
//Rota da API para buscar somente os animais que estão internados na clínica:
async function getAllHospitalizedPets (req, res) {
    try {
        const result = await pool.query(
            `SELECT h.hospitalization_id, h.cage_number, h.reason, h.entry_date, h.requested_exams,
             h.results_exams, h.hospitalization_observations, h.pet_id, p.pet_name, o.owners_name, o.owners_contact, 
             h.consultation_id, h.veterinarian_CPF
            FROM hospitalizations h 
            JOIN pets p ON h.pet_id = p.pet_id 
            JOIN pet_owners o ON p.owners_CPF = o.owners_CPF`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error when consulting hospitalized animals.'})
    }
};

//POST
//Rota da API para cadastrar um novo animal na internação:
async function createNewHospitalization (req, res) {
    try {
    const { cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams,
        death, time_death, date_death, hospitalization_observations, pet_id, consultation_id, veterinarian_CPF } = req.body;
    const result = await pool.query(
        `INSERT INTO hospitalizations (cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams,
            death, time_death, date_death, hospitalization_observations, pet_id, consultation_id, veterinarian_CPF) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING *`,
        [cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams,
            death, time_death, date_death, hospitalization_observations, pet_id, consultation_id, veterinarian_CPF]
    );
    res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Error creating hospitalization.'})
    }
};

//PUT
// Rota da API para editar os dados de internação de um animal da clínica:
async function updateHospitalizationById (req, res) {
    try {
        const { hospitalization_id } = req.params;
        const { cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams, death, time_death, date_death, hospitalization_observations, pet_id, consultation_id, veterinarian_CPF } = req.body;
        const result = await pool.query(
            `UPDATE hospitalizations 
            SET cage_number = $1, reason = $2, entry_date = $3, discharge_date = $4,
                discharge_time = $5, requested_exams = $6, results_exams = $7, death = $8, time_death = $9,
                date_death = $10, hospitalization_observations = $11, pet_id = $12, consultation_id = $13,
                veterinarian_CPF = $14
                WHERE hospitalization_id = $15
                RETURNING *`,
            [cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams,
                death, time_death, date_death, hospitalization_observations, pet_id, consultation_id,
                veterinarian_CPF, hospitalization_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Hospitalization not found with specified ID.'});
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Unexpected error occurred while updating hospitalization information.'});
    }
};

//DELETE
//Rota da API para deletar uma internação de um animal (com o tratamento e o monitoramento também deletados):
async function deleteHospitalizationById (req, res) {
    try {
        const { hospitalization_id } = req.params;
        const result = await pool.query(
            `DELETE FROM hospitalizations
            WHERE hospitalizations_id = $1
            RETURNING *`,
            [hospitalization_id]
        );
        if(result.rows.length === 0) {
            return res.status(404).json({message: 'Hospitalization not found.'})
        }
        res.status(204).send();
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Unexpected error occurred while deleting hospitalization.'});
    }
};

module.exports = {
    getAllHospitalizedPets,
    createNewHospitalization,
    updateHospitalizationById,
    deleteHospitalizationById,
};
