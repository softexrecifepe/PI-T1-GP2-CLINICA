require('dotenv').config()

const express = require('express');
const { pool } = require('./database/dbConnection');

const app = express();
const port = 3000;

app.use(express.json());

//GET
//Rota da API para buscar todos os animais (internados ou não) da clínica:
app.get('/pets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pets');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error when consulting registered animals.')
    }
});

//Rota da API para buscar somente os animais que estão internados na clínica:
app.get('/pets/hospitalizations', async (req, res) => {
    try {
        const result = await pool.query(`SELECT h.hospitalization_id, h.cage_number, h.reason, h.entry_date, h.requested_exams,
             h.results_exams, h.hospitalization_observations, h.pet_id, p.pet_name, o.owners_name, o.owners_contact, 
             h.consultation_id, h.veterinarian_CPF
            FROM hospitalizations h 
            JOIN pets p ON h.pet_id = p.pet_id 
            JOIN pet_owners o ON p.owners_CPF = o.owners_CPF
            WHERE h.discharge_date IS null AND h.death = FALSE`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error when consulting hospitalized animals.')
    }
});

//Rota da API para buscar quais os tratamentos(medicações) que cada animal está tomando:
app.get('/hospitalizations/treatments', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.treatment_id, t.medication_name, t.medication_period, t.medication_dosage, t.medication_interval,
                t.medication_check, t.administration_route, t.treatment_observations, t.hospitalization_id, t.veterinarian_CPF,
                t.nurse_CPF, p.pet_id, p.pet_name, p.weight, p.species, p.breed, p.behavior, p.allergies
                FROM treatments t
                JOIN hospitalizations h ON t.hospitalization_id = h.hospitalization_id
                JOIN pets p ON h.pet_id = p.pet_id`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error when consulting animals treatments.')
    }
});

//POST
//Rota da API para cadastrar um novo tutor responsável por um animal:
app.post('/pet-owners', async (req, res) => {
    const { owners_cpf, owners_name, owners_rg, owners_contact, owners_adress } = req.body;

    const result = await pool.query(
        `INSERT INTO pet_owners (owners_cpf, owners_name, owners_rg, owners_contact, owners_adress) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [owners_cpf, owners_name, owners_rg, owners_contact, owners_adress]
    );
    res.status(201).json(result.rows[0]);
});

//Rota da API para cadastrar um novo animal na clínica:
app.post('/pets', async (req, res) => {
    const { pet_name, microchip_code, behavior, species, gender, age, breed, weight, physical_characteristics,
        allergies, diseases, owners_cpf } = req.body;

    const result = await pool.query(
        `INSERT INTO pets (pet_name, microchip_code, behavior, species, gender, age, breed, weight, physical_characteristics, 
            allergies, diseases, owners_cpf) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [pet_name, microchip_code, behavior, species, gender, age, breed, weight, physical_characteristics,
            allergies, diseases, owners_cpf]
    );
    res.status(201).json(result[0]);
});

//Rota da API para cadastrar um novo animal na internação:
app.post('/pets/hospitalizations', async (req, res) => {
    const { cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams,
        death, time_death, date_death, hospitalization_observations, pet_id, consultation_id, veterinarian_CPF } = req.body;

    const result = await pool.query(
        `INSERT INTO hospitalizations (cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams,
            death, time_death, date_death, hospitalization_observations, pet_id, consultation_id, veterinarian_CPF) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [cage_number, reason, entry_date, discharge_date, discharge_time, requested_exams, results_exams,
            death, time_death, date_death, hospitalization_observations, pet_id, consultation_id, veterinarian_CPF]
    );
    res.status(201).json(result[0]);
});

//Rota da API para cadastrar um tratamento para um animal que está internado:
app.post('/hospitalizations/treatments', async (req, res) => {
    const { medication_name, medication_period, medication_dosage, medication_interval, medication_check, administration_route,
        treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF } = req.body;

    const result = await pool.query(
        `INSERT INTO treatments (medication_name, medication_period, medication_dosage, medication_interval, medication_check,
            administration_route, treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [medication_name, medication_period, medication_dosage, medication_interval, medication_check, administration_route,
            treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF]
    );
    res.status(201).json(result[0]);
});

//Rota da API para cadastrar um monitoramento para um animal que está internado:
app.post('/hospitalizations/monitoring', async (req, res) => {
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
    res.status(201).json(result[0]);
});

//PUT
//Rota da API para editar os dados de internação de um animal da clínica:
app.put('', (req, res) => {

});


//DELETE
//Rota da API para deletar um animal que está internado na clínica:
app.delete('', (req, res) => {

});


//Conexão com o servidor e com o banco de dados:
app.listen(port, () => {
    pool.connect().then(client => {
        console.log('Connect to the database.');
        client.release();
    }).catch(err => {
        console.error('Error connecting to the database', err);
    });
    console.log(`Server is running on port ${port}.`);
});