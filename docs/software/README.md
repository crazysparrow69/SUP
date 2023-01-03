# Реалізація інформаційного та програмного забезпечення

В рамках проекту розробляється:

## SQL-скрипт для створення на початкового наповнення бази даних
```sql
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema SUP
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `SUP` ;

-- -----------------------------------------------------
-- Schema SUP
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `SUP` DEFAULT CHARACTER SET utf8 ;
USE `SUP` ;

-- -----------------------------------------------------
-- Table `SUP`.`artifact`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SUP`.`artifact` ;

CREATE TABLE IF NOT EXISTS `SUP`.`artifact` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SUP`.`task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SUP`.`task` ;

CREATE TABLE IF NOT EXISTS `SUP`.`task` (
  `id` INT NOT NULL,
  `description` VARCHAR(100) NOT NULL,
  `deadline` DATETIME NULL DEFAULT NULL,
  `artifact_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_task_artifact1_idx` (`artifact_id` ASC) VISIBLE,
  CONSTRAINT `fk_task_artifact1`
    FOREIGN KEY (`artifact_id`)
    REFERENCES `SUP`.`artifact` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SUP`.`project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SUP`.`project` ;

CREATE TABLE IF NOT EXISTS `SUP`.`project` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `team` VARCHAR(45) NULL,
  `task_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_project_task1_idx` (`task_id` ASC) VISIBLE,
  CONSTRAINT `fk_project_task1`
    FOREIGN KEY (`task_id`)
    REFERENCES `SUP`.`task` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SUP`.`member`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SUP`.`member` ;

CREATE TABLE IF NOT EXISTS `SUP`.`member` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `task_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_member_task1_idx` (`task_id` ASC) VISIBLE,
  CONSTRAINT `fk_member_task1`
    FOREIGN KEY (`task_id`)
    REFERENCES `SUP`.`task` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SUP`.`team`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SUP`.`team` ;

CREATE TABLE IF NOT EXISTS `SUP`.`team` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `icon` BLOB NULL,
  `memberList` VARCHAR(45) NULL,
  `project_id` INT NOT NULL,
  `member_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_team_project_idx` (`project_id` ASC) VISIBLE,
  INDEX `fk_team_member1_idx` (`member_id` ASC) VISIBLE,
  CONSTRAINT `fk_team_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `SUP`.`project` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_team_member1`
    FOREIGN KEY (`member_id`)
    REFERENCES `SUP`.`member` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SUP`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SUP`.`user` ;

CREATE TABLE IF NOT EXISTS `SUP`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `isAdmin` VARCHAR(45) NOT NULL,
  `member_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `fk_user_member1_idx` (`member_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_member1`
    FOREIGN KEY (`member_id`)
    REFERENCES `SUP`.`member` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SUP`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SUP`.`role` ;

CREATE TABLE IF NOT EXISTS `SUP`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `member_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_role_member1_idx` (`member_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_role_member1`
    FOREIGN KEY (`member_id`)
    REFERENCES `SUP`.`member` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

```

# RESTfull сервіс для управління даними

## Кореневий файл серверу

```js
const db = require('./config/db_connection');
const express = require('express');
const app = express();

// Global variables
const PORT = 3500;

// Built-in middleware for json
app.use(express.json());

// Routes
app.use('/api', require('./routes/apiRoute'));

// Connection
db.connect(() => app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)));
```

## Файл підключення до бази даних

```js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '564793',
    database: 'sup'
});

module.exports = db;
```

##  Файл з роутером

 ```js
const express = require('express');
const router = express.Router();
const { getAllArtifacts, getOneArtifact, createNewArtifact, updateOneArtifact, deleteOneArtifact } = require('../controllers/apiController');

router.get('/', getAllArtifacts)
      .get('/:id', getOneArtifact)
      .post('/', createNewArtifact)
      .put('/:id', updateOneArtifact)
      .delete('/:id', deleteOneArtifact);

module.exports = router;

 ```

##  Файл контролерів для обробки запитів

```js
const db = require('../config/db_connection');

const getAllArtifacts = (req, res) => {
    const query = 'SELECT * FROM artifact';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
};

const getOneArtifact = (req, res) => {
    const query = `SELECT * FROM artifact WHERE id=${req.params.id}`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.sendStatus(404);
        res.status(200).json(result);
    });
};

const createNewArtifact = (req, res) => {
    if (!req.body.name || !req.body.description) return res.status(400).json({ 'message': 'Name and description required' });

    const query = 'INSERT INTO artifact SET ?';
    const artifact = {
        name: req.body.name,
        description: req.body.description
    };
    db.query(query, artifact, (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ 'message': 'New artifact created' });
    });
};

const updateOneArtifact = (req, res) => {
    if (!req.body.name && !req.body.description) return res.status(204).json({ 'message': 'Name or description required' });

    let query = '';
    if (req.body.name) {
        query = `UPDATE artifact SET name = '${req.body.name}' WHERE id = '${req.params.id}'`;
        db.query(query, (err) => { if (err) return res.status(500).json(err) });
    }
    if (req.body.description) {
        query = `UPDATE artifact SET description = '${req.body.description}' WHERE id = '${req.params.id}'`;
        db.query(query, (err) => { if (err) return res.status(500).json(err) });
    }

    res.status(200).json({ 'message': 'Artifact updated' });
};

const deleteOneArtifact = (req, res) => {
    const query = `DELETE FROM artifact WHERE id=${req.params.id}`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ 'message': 'Artifact deleted' });
    });
};

module.exports = { 
    getAllArtifacts,
    getOneArtifact,
    createNewArtifact,
    updateOneArtifact,
    deleteOneArtifact
};
```

