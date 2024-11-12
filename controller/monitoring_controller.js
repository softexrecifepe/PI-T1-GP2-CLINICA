
const { pool } = require('./database/dbConnection');

//GET
//Rota da API para buscar o monitoramento de cada animal:

//POST
//Rota da API para cadastrar um monitoramento para um animal que está internado:

//PUT
// Rota da API para editar os dados de monitoramento de um animal da clínica:
async function updateMonitoringById (req, res) {
    try {
        const { monitoring_id } = req.params;
        const { mucous_membrane, level_consciousness, pulse, fluid_therapy, dehydratation_level, rate,
            replacement, feeding, saturation, respiratory_rate, emesis, TPC, heart_rate,
            stool_check, glucose_check, urine_check, temperature_check, hospitalization_id, veterinarian_CPF, nurse_CPF } = req.body;
        const result = await pool.query(
            `UPDATE monitoring 
            SET mucous_membrane = $1, level_consciousness = $2, pulse = $3, fluid_therapy = $4,
                dehydratation_level = $5, rate = $6, replacement = $7, feeding = $8, saturation = $9,
                respiratory_rate = $10, emesis = $11, TPC = $12, heart_rate = $13, stool_check = $14,
                glucose_check = $15, urine_check = $16, temperature_check = $17, hospitalization_id = $18,
                veterinarian_CPF = $19, nurse_CPF = $20 
            WHERE monitoring_id = $21 
            RETURNING *`,
            [mucous_membrane, level_consciousness, pulse, fluid_therapy, dehydratation_level, rate,
                replacement, feeding, saturation, respiratory_rate, emesis, TPC, heart_rate,
                stool_check, glucose_check, urine_check, temperature_check, hospitalization_id,
                veterinarian_CPF, nurse_CPF, monitoring_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Monitoring record not found with specified ID.'});
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Unexpected error occurred while updating monitoring information.'});
    }
};


module.exports = {
    updateMonitoringById
};