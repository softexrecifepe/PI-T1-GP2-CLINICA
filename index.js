require('dotenv').config()

const express = require('express');
const app = express();
const dbConnection = require('./database/dbConnection');
const port = 3000;

app.use(express.json());

//Rota da API para buscar todos os tutores e animais (internados ou não) da clínica:
app.get('/pets', (req, res) => {
    const sql = 
    `SELECT 
    po.owners_CPF AS tutor_id, po.owners_name AS tutor_name, po.owners_contact AS tutor_contact,
    p.pet_id, p.pet_name, p.microchip_code, p.behavior, p.species, p.gender,
    p.age, p.breed, p.weight, p.physical_characteristics, p.allergies, p.diseases,
    v.veterinarian_name AS consultation_veterinarian,
    c.diagnosis, c.referred_hospitalization,
    h.hospitalization_id, h.reason, h.entry_date, h.discharge_date, h.discharge_time, h.requested_exams, h.results_exams,
    h.death, h.time_death, h.date_death, h.hospitalization_observations,
    v_hosp.veterinarian_name AS hospitalization_veterinarian,
    n.nurse_name AS hospitalization_nurse,
    t.treatment_id, t.medication_name, t.medication_period, t.medication_dosage,
    t.medication_interval, t.medication_check, t.administration_route, t.treatment_observations,
    m.monitoring_id, m.mucous_membrane, m.level_consciousness, m.pulse, m.fluid_therapy, m.dehydratation_level, 
    m.rate, m.replacement, m.feeding, m.saturation, m.respiratory_rate, m.emesis,
    m.TPC, m.heart_rate, m.stool_check, m.glucose_check, m.urine_check, m.temperature_check
FROM pets p
JOIN pet_owners po ON p.owners_CPF = po.owners_CPF
LEFT JOIN consultations c ON p.pet_id = c.pet_id
LEFT JOIN veterinarians v ON c.veterinarian_CPF = v.veterinarian_CPF
LEFT JOIN hospitalizations h ON p.pet_id = h.pet_id AND c.referred_hospitalization = TRUE
LEFT JOIN veterinarians v_hosp ON h.veterinarian_CPF = v_hosp.veterinarian_CPF
LEFT JOIN nurses n ON h.hospitalization_id = n.nurse_CPF
LEFT JOIN treatments t ON h.hospitalization_id = t.hospitalization_id
LEFT JOIN monitoring m ON h.hospitalization_id = m.hospitalization_id`;

    dbConnection.query(sql, (err, results) => {
        if(err) {
            console.error('Error searching for registered pets', err);
            return res.status(500).json({error: 'Internal Server Error.'});
        }
        res.json(results);
    });
});


//Rota da API para buscar somente os animais que estão internados na clínica:

//Rota da API para buscar um animal específico que está internado na clínica:

//Rota da API para cadastrar um novo animal na internação da clínica:

//Rota da API para editar os dados de internação de um animal da clínica:

//Rota da API para deletar um animal que está internado na clínica:


//Conexão com o servidor e com o banco de dados:
app.listen(port, () => {
    dbConnection.connect((err) => {
        if(err) {
            console.error('Error connecting to database:', err.stack);
            return;
        }
        console.log('connected to the database as id', dbConnection.threadId);        
    });
    console.log(`Server is running on port: ${port}.`);
});