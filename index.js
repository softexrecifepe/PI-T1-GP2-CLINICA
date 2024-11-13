
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
app.get('/hospitalizations/treatments', TreatmentsController.getAllTreatments);

//Rota da API para buscar o monitoramento de cada animal:
app.get('/hospitalizations/monitoring', MonitoringController.getAllMonitoring);

//Rota da API para buscar um tutor e os animais que estão cadastrados no id dele:
app.get('/pet_owners/:owners_cpf', PetOwnersController.getOwnerById);

//Rota da API para buscar um animal específico:
app.get('/pets/:pet_id', PetsController.getPetById);

//POST
//Rota da API para cadastrar um novo tutor responsável por um animal:
app.post('/pet_owners', PetOwnersController.createNewOwner);

//Rota da API para cadastrar um novo animal na clínica:
app.post('/pets', PetsController.createNewPet);

//Rota da API para cadastrar um novo animal na internação:
app.post('/pets/hospitalizations', HospitalizationsController.createNewHospitalization);

//Rota da API para cadastrar um tratamento para um animal que está internado:
app.post('/hospitalizations/treatments', TreatmentsController.createNewTreatment);

//Rota da API para cadastrar um monitoramento para um animal que está internado:
app.post('/hospitalizations/monitoring', MonitoringController.createNewMonitoring);

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
