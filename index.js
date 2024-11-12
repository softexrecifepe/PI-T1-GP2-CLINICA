
require('dotenv').config()

const express = require('express');
const cors = require('cors');
const { pool } = require('./database/dbConnection');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const PetOwnersController = require('./controller/petOwners_controller');
const PetsController = require('./controller/pets_controller');
const HospitalizationsController = require('./controller/hospitalizations_controller');
const TreatmentsController = require('./controller/treatments_controller');
const MonitoringController = require('./controller/monitoring_controller');

//GET
//Rota da API para buscar todos os animais (internados ou não) da clínica:
app.get('/pets', PetsController.getAllPets);

//Rota da API para buscar somente os animais que estão internados na clínica:
app.get('/pets/hospitalizations', HospitalizationsController.getAllHospitalizedPets);

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
        res.status(500).json({message: 'Error when consulting animals treatments.'})
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
        res.status(500).json({message: 'Error when consulting animals monitoring.'});
    }
});

//Rota da API para buscar um tutor e os animais que estão cadastrados no id dele:
app.get('/pet_owners/:owners_cpf', async (req, res) => {
    try {
        const { owners_cpf } = req.params;
        const result = await pool.query(
            `SELECT po.*, p.pet_id, p.pet_name, p.species, p.breed FROM pet_owners po
            JOIN pets p ON po.owners_cpf = p.owners_cpf
            WHERE po.owners_CPF = $1`, 
            [owners_cpf]
        );
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Pet owner not found.'})
        }

        const owner = {
            owners_cpf: result.rows[0].owners_cpf,
            owners_name: result.rows[0].owners_name,
            owners_rg: result.rows[0].owners_rg,
            owners_contact: result.rows[0].owners_contact,
            owners_adress: result.rows[0].owners_adress,
            pets: result.rows.map(row => ({
                pet_id: row.pet_id,
                pet_name: row.pet_name, 
                species: row.species,
                breed: row.breed
            }))
        };
        res.status(200).json(owner);
    } catch (err) {
        console.error('Error searching for pet owner:', err);
        res.status(500).json({message: 'Error searching for pet owner.'});
    }
});

//Rota da API para buscar um animal específico:
app.get('/pets/:pet_id', async (req, res) => {
        try {
        const { pet_id } = req.params;
        const result = await pool.query(
            `SELECT p.*, po.owners_CPF, po.owners_name FROM pets p 
            JOIN pet_owners po ON p.owners_CPF = po.owners_CPF WHERE p.pet_id = $1`, 
            [pet_id]
        );
        if(result.rows.length === 0) {
            return res.status(404).json({message: 'Pet not found.'})
        }
        res.status(200).json(result.rows[0]);
    } catch(err) {
        console.error('Error searching for pet:' , err);
        res.status(500).json({message: 'Error searching for pet.'});
    }
});

//POST
//Rota da API para cadastrar um novo tutor responsável por um animal:
app.post('/pet_owners', async (req, res) => {
    try {
    const { owners_cpf, owners_name, owners_rg, owners_contact, owners_adress } = req.body;
    const result = await pool.query(
        `INSERT INTO pet_owners (owners_cpf, owners_name, owners_rg, owners_contact, owners_adress) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
        [owners_cpf, owners_name, owners_rg, owners_contact, owners_adress]
    );
    res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Error creating pet owner.'})
    }
});

//Rota da API para cadastrar um novo animal na clínica:
app.post('/pets', async (req, res) => {
    try {
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
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Error creating pet.'})
    }
});

//Rota da API para cadastrar um novo animal na internação:
app.post('/pets/hospitalizations', HospitalizationsController.createNewHospitalization);

//Rota da API para cadastrar um tratamento para um animal que está internado:
app.post('/hospitalizations/treatments', async (req, res) => {
    try {
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
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Error creating treatment.'})
    }
});

//Rota da API para cadastrar um monitoramento para um animal que está internado:
app.post('/hospitalizations/monitoring', async (req, res) => {
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
});

//PUT
//Rota da API para editar os dados de um tutor que é responsável por um animal:
app.put('/pet_owners/:owners_cpf', PetOwnersController.updatePetOwnerById);

//Rota da API para editar os dados de um animal:
app.put('/pets/:pet_id', PetsController.updatePetById);

// Rota da API para editar os dados de internação de um animal da clínica:
app.put('/hospitalizations/:hospitalization_id', HospitalizationsController.updateHospitalizationById);

// Rota da API para editar os dados de tratamento de um animal da clínica:
app.put('/hospitalizations/treatments/:treatment_id', TreatmentsController.updateTreatmentById);

// Rota da API para editar os dados de monitoramento de um animal da clínica:
app.put('/hospitalizations/monitoring/:monitoring_id', MonitoringController.updateMonitoringById);

//DELETE
//Rota da API para deletar um tutor (após deletar o tutor os dados do pet também serão deletados de todas as tabelas):
app.delete('/pet_owners/:owners_cpf', PetOwnersController.deletePetOwnerById);

// Rota da API para deletar apenas um pet sem deletar o tutor:
app.delete('/pets/:pet_id', PetsController.deletePetById);

//Rota da API para deletar uma internação de um animal (com o tratamento e o monitoramento também deletados):
app.delete('/hospitalizations/:hospitalization_id', HospitalizationsController.deleteHospitalizationById);

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
