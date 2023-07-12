CREATE DATABASE vetmed2;

--set extention
CREATE TABLE  veterinaryInfo(	vetId SERIAL PRIMARY KEY ,	vetName VARCHAR(30) NOT NULL,	vetSurname VARCHAR(30) NOT NULL,	branch_Name VARCHAR(50) NOT NULL,	address VARCHAR(100) NOT NULL ,	email VARCHAR(30) NOT NULL,	phone VARCHAR(11) NOT NULL,	password VARCHAR(255) NOT NULL);

CREATE TABLE patienceOwnerInfo(cid SERIAL PRIMARY KEY,	cName VARCHAR(30) NOT NULL,	cSurname VARCHAR(30) NOT NULL,	clientPhone VARCHAR(11) NOT NULL,clientEmail VARCHAR(30) NOT NULL,	clientAddress VARCHAR(100) NOT NULL, numOfPet INT NOT NULL,cPassword VARCHAR(255) NOT NULL,vetId INT, FOREIGN KEY (vetId) REFERENCES  veterinaryInfo(vetId));

-- insert fake user
INSERT INTO veterinaryInfo(vetName, vetSurname, branch_Name,address,email,phone,password) VALUES ('Sila','Gedik','cerrahi','ankara/yenimahalle','slgedik42@gmail.com','05071233736','sila123');