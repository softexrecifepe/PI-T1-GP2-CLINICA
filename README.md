# PI-T1-GP2-CLINICA

# Clínica Veterinária Mascot's

## Descrição
Este é um projeto de Back End para a *Clínica Veterinária Mascot's*, que visa gerenciar informações sobre animais, médicos veterinários, atendimentos e agendamentos. A aplicação é construída com JavaScript e utiliza o PostgreSQL como banco de dados.

## Tecnologias Utilizadas
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" width="30" height="30"/> **JavaScript** (Linguagem utilizada no desenvolvimento do projeto)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" width="30" height="30"/> **Node.js** (Ambiente de execução JavaScript)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="Express.js" width="30" height="30"/> **Express.js** (Framework para construção da API)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="30" height="30"/> **PostgreSQL** (Banco de dados relacional)
- <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/dotenv.svg" alt="dotenv" width="30" height="30"/> **dotenv** (Gerenciamento de variáveis de ambiente)
- <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/postman-icon.svg" alt="Postman" width="30" height="30"/> **Postman** (Ferramenta para documentação e testes da API)

## Funcionalidades
- Cadastro de **animais** e seus dados.
- Cadastro de **clientes** (donos dos animais).
- Cadastro de **médicos veterinários**.
- Agendamento de **consultas e atendimentos**.
- Histórico de **atendimentos**.
- **Consulta** de animais, clientes, médicos e atendimentos.
- **Atualização** e **exclusão** de dados.

## Endpoints da API
A API está documentada e pode ser consultada no Postman. Você pode visualizar todos os endpoints disponíveis para interação com o sistema acessando a documentação [aqui](https://documenter.getpostman.com/view/39818047/2sAYBUDs5s).

## Desenvolvedores:
- ### Leonardo Rafael
  - Github: [/LeonardoRDA1604](https://github.com/LeonardoRDA1604)
  - LinkedIn: [/leonardorafael1604](https://www.linkedin.com/in/leonardorafael1604/)

- ### Stephanie G. Pinheiro
  - GitHub: [/stephaniegpinheiro](https://github.com/stephaniegpinheiro)
  - LinkedIn: [/stephaniegpinheiro](https://www.linkedin.com/in/stephaniegpinheiro/)

## Como Rodar o Projeto

### 1. Clonar o Repositório
Clone o repositório do GitHub para sua máquina local:

```bash
git clone https://github.com/softexrecifepe/PI-T1-GP2-CLINICA.git
```

### 2. Instalar Dependências
Acesse o diretório do projeto e instale as dependências necessárias utilizando o npm:
```bash
cd PI-T1-GP2-CLINICA
npm install
```

### 3. Configuração do Banco de Dados
O projeto utiliza o PostgreSQL. Para configurar o banco de dados, faça o seguinte:
- Crie um banco de dados no PostgreSQL (exemplo: clinica_veterinaria).
- Configure as variáveis de ambiente para conectar o projeto ao banco de dados. O arquivo `.env` deve conter as informações de acesso ao banco.

Exemplo de configuração no arquivo `.env`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=clinica_veterinaria
```

### 4. Rodar a Aplicação
Com as dependências instaladas e o banco de dados configurado, inicie o servidor:
```bash
npm start
```

### Contribuição
Contribuições são bem-vindas! Se você deseja contribuir com melhorias ou correções para o projeto, basta seguir estes passos:
1. Faça um fork deste repositório.
2. Crie uma branch para sua feature ou correção.
3. Envie um pull request.

### Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.
