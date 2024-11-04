
require('dotenv').config()

const express = require('express');
const cors = require('cors');
const { pool } = require('./database/dbConnection');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


//GET
//Rota da API para buscar todos os animais (internados ou não) da clínica:
app.get('/pets', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM pets`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error when consulting registered animals.')
    }
});

//Rota da API para buscar somente os animais que estão internados na clínica:
app.get('/pets/hospitalizations', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT h.hospitalization_id, h.cage_number, h.reason, h.entry_date, h.requested_exams,
             h.results_exams, h.hospitalization_observations, h.pet_id, p.pet_name, o.owners_name, o.owners_contact, 
             h.consultation_id, h.veterinarian_CPF
            FROM hospitalizations h 
            JOIN pets p ON h.pet_id = p.pet_id 
            JOIN pet_owners o ON p.owners_CPF = o.owners_CPF
            WHERE h.discharge_date IS null AND h.death = FALSE`
        );
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
                JOIN pets p ON h.pet_id = p.pet_id`
            );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error when consulting animals treatments.')
    }
});

//Rota da API para buscar o monitoramento de cada animal:
app.get('/hospitalizations/monitoring', async (req, res) => {
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
        res.status(500).send('Error when consulting animals monitoring.');
    }
});

//POST
//Rota da API para cadastrar um novo tutor responsável por um animal:
app.post('/pet-owners', async (req, res) => {
    const { owners_cpf, owners_name, owners_rg, owners_contact, owners_adress } = req.body;
    const result = await pool.query(
        `INSERT INTO pet_owners (owners_cpf, owners_name, owners_rg, owners_contact, owners_adress) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
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
            allergies, diseases, owners_cpf) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *`,
        [pet_name, microchip_code, behavior, species, gender, age, breed, weight, physical_characteristics,
            allergies, diseases, owners_cpf]
    );
    res.status(201).json(result.rows[0]);
});

//Rota da API para cadastrar um novo animal na internação:
app.post('/pets/hospitalizations', async (req, res) => {
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
});

//Rota da API para cadastrar um tratamento para um animal que está internado:
app.post('/hospitalizations/treatments', async (req, res) => {
    const { medication_name, medication_period, medication_dosage, medication_interval, medication_check, administration_route,
        treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF } = req.body;
    const result = await pool.query(
        `INSERT INTO treatments (medication_name, medication_period, medication_dosage, medication_interval, medication_check,
            administration_route, treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
        [medication_name, medication_period, medication_dosage, medication_interval, medication_check, administration_route,
            treatment_observations, hospitalization_id, veterinarian_CPF, nurse_CPF]
    );
    res.status(201).json(result.rows[0]);
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
    res.status(201).json(result.rows[0]);
});

//PUT
//Rota da API para editar os dados de um tutor que é responsável por um animal:
app.put('/pet-owners/:owners_cpf', async (req, res) => {
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
            res.status(404).json({ err: 'Owner not found.' })
        };
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Error updating tutor data.' });
    }
});

//Rota da API para editar os dados de um animal:
app.put('/pets/:pet_id', async (req, res) => {
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
            return res.status(404).send('Pet not found.');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating pet information.');
    }
});

// Rota da API para editar os dados de internação de um animal da clínica:
app.put('/hospitalizations/:hospitalization_id', async (req, res) => {
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
            return res.status(404).send('Hospitalization not found.');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating hospitalization information.');
    }
});

// Rota da API para editar os dados de tratamento de um animal da clínica:
app.put('/hospitalizations/treatments/:treatment_id', async (req, res) => {
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
            return res.status(404).send('Treatment not found.');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating treatment information.');
    }
});

// Rota da API para editar os dados de monitoramento de um animal da clínica:
app.put('/hospitalizations/monitoring/:monitoring_id', async (req, res) => {
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
            return res.status(404).send('Monitoring record not found.');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating monitoring information.');
    }
});

//DELETE
//Rota da API para deletar um tutor (após deletar o tutor os dados do pet também serão deletados de todas as tabelas):
app.delete('/pet-owners/:owners_cpf', async (req, res) => {
    try {
        const { owners_cpf } = req.params;
        const checkOwner = await pool.query(
            `SELECT * 
            FROM pet_owners 
            WHERE owners_cpf = $1`, 
            [owners_cpf]
        );
        if (checkOwner.rows.length === 0) {
            return res.status(404).json({ err: 'Pet owner not found.' })
        };
        await pool.query(
            `DELETE 
            FROM pet_owners 
            WHERE owners_cpf = $1`, 
            [owners_cpf]
        );
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(`Unexpected error: ${err.message}`);
    }
});

// Rota da API para deletar apenas um pet sem deletar o tutor:
app.delete('/pets/:pet_id', async (req, res) => {
    try {
        const { pet_id } = req.params;
        const checkPet = await pool.query(
            `SELECT * 
            FROM pets 
            WHERE pet_id = $1`, 
            [pet_id]);
        if (checkPet.rows.length === 0) {
            return res.status(404).json({ err: 'Pet not found.' });
        }
        await pool.query(
            `DELETE 
            FROM pets 
            WHERE pet_id = $1`, 
            [pet_id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(`Unexpected error: ${err.message}`);
    }
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
