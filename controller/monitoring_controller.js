
const { pool } = require('../database/dbConnection');

//GET
//Rota da API para buscar o monitoramento de cada animal:
async function getAllMonitoring (req, res) {
    try {
        const result = await pool.query(
            `SELECT m.monitoring_id, m.mucous_membrane, m.level_consciousness, m.pulse, m.fluid_therapy,
                m.dehydratation_level, m.rate, m.replacement, m.feeding, m.saturation, m.respiratory_rate, 
                m.emesis, m.TPC, m.heart_rate, m.stool_check, m.glucose_check, m.urine_check, m.temperature_check, 
                m.hospitalization_id, m.veterinarian_CPF, m.nurse_CPF, p.pet_id, p.pet_name, p.behavior, p.diseases
                FROM monitoring m
                JOIN hospitalizations h ON m.hospitalization_id = h.hospitalization_id
                JOIN pets p ON h.pet_id = p.pet_id`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error when consulting animals monitoring.'});
    }
};

//POST
//Rota da API para cadastrar um monitoramento para um animal que está internado:
async function createNewMonitoring (req, res) {
    try {
    const { mucous_membrane, level_consciousness, pulse, fluid_therapy, dehydratation_level, rate, replacement, feeding,
        saturation, respiratory_rate, emesis, TPC, heart_rate, stool_check, glucose_check, urine_check, temperature_check,
        hospitalization_id, veterinarian_CPF, nurse_CPF } = req.body;
    const result = await pool.query(
        `INSERT INTO monitoring (mucous_membrane, level_consciousness, pulse, fluid_therapy, dehydratation_level, rate,
            replacement, feeding, saturation, respiratory_rate, emesis, TPC, heart_rate, stool_check, glucose_check, 
                urine_check, temperature_check, hospitalization_id, veterinarian_CPF, nurse_CPF) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *`,
        [mucous_membrane, level_consciousness, pulse, fluid_therapy, dehydratation_level, rate, replacement, feeding,
            saturation, respiratory_rate, emesis, TPC, heart_rate, stool_check, glucose_check, urine_check, temperature_check,
            hospitalization_id, veterinarian_CPF, nurse_CPF]
    );
    res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Error creating monitoring.'})
    } 
};

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
    getAllMonitoring,
    createNewMonitoring,
    updateMonitoringById
};
