import { Request, Response } from "express";
import { getMongoManager } from "typeorm";
import { PersonEntity } from "../entity/Person.entity";
import { SsnEntity } from "../entity/Ssn.entity";
import { PersonModel } from "../model/Person.model";
import { SsnModel } from "../model/Ssn.model";
import { ObjectID } from "mongodb";
import * as FileSystem from "fs"
import * as path from "path";
import cons = require("consolidate");
import { json } from "body-parser";

/**
 * Rappel des erreurs HTTP les plus importantes:
 * ---------------------------------------------
 * 
 * 200 : succès de la requête ;
 * 301 et 302 : redirection, respectivement permanente et temporaire ;
 * 401 : utilisateur non authentifié ;
 * 403 : accès refusé ;
 * 404 : page non trouvée ;
 * 409 : conflit;
 * 500 et 503 : erreur serveur ;
 * 504 : le serveur n'a pas répondu.
 * 
 * source : wikipedia
 */

 /**
  * LA REQUETE DOIT ETRE
  * {
  *     name: "name",
  *     lastname: "lastname",
  *     ssn: "ssn"
  * }
  * OU POUR LES GET
  * {
  *     id: "id"
  * }
  * 
  */

export class PersonMiddleware{

    /**
     * Sauvegarde une personne.
     * La requête doit contenir l'utilisateur à sauvegarder.
     */
    public static save(req: Request, res: Response, next: any){
        let person: PersonEntity = new PersonEntity();
        let ssn = res.locals.ssn ? res.locals.ssn : new SsnModel(req.body.ssn);
        person.lastname = req.body.lastname;
        person.name = req.body.name;
        person.ssn = Object.assign(new SsnEntity(),ssn);
        
        getMongoManager().save(person)
        .then(user => {
            if(user)
                return res.status(200).send(person);

            return res.status(500).send("user cannot be save");
        });
    }

    public static getDepName(req: Request, res: Response, next: any){
        let ssn = new SsnModel(req.body.ssn)
        res.locals.ssn = ssn;
        if(ssn.valable){
            ssn.getDepartementName().then((value: string)=> {
                ssn.departementNom = value;
                ssn.pays = "France";
                ssn.getVilleName().then((value:string) => {
                    ssn.villeNom = value;
                    next();
                }).catch(err => next())
            }).catch((err) =>{
                FileSystem.readFile(path.join(__dirname+"/pays.json"), 'utf8', (err, data) =>{
                    if(err) res.status(500).send(err.stack);
                    let pays = JSON.parse(data);
                    ssn.pays = pays[ssn.ville];
                    ssn.departementNom = "Etranger"
                    ssn.villeNom = "Etranger"
                    next();
                })
            });
        }
        else
            return res.status(500).send("user cannot be save. Bad ssn");
    }

    /**
     * Récupère une personne.
     * La requête doit contenir l'id de la personne.
     */
    public static get(req: Request, res: Response, next: any){
        const id = req.params.id;

        getMongoManager().findOne(PersonEntity, {_id : new ObjectID(id)})
        .then(result => {
            if (result) {
                return res.status(200).json(result);
            }

            return res.status(404).send(`No user found with id (${id})`);
        });
    }

    /**
     * Récupère l'ensemble des personnes.
     */
    public static getList(req: Request, res: Response, next: any) {
        getMongoManager().find(PersonEntity)
        .then(result => {
            return res.status(200).json(result);
        });
    }

    /**
     * Mets à jour une personne
     * La requête doit l'objet de la personne à modifier
     */
    public static update(req: Request, res: Response, next: any) {
        let _id = req.params.id;
        let PersonUpdate: PersonEntity = new PersonEntity();
        PersonUpdate.lastname = req.body.lastname;
        PersonUpdate.name = req.body.name;
        if(req.body.ssn){
            PersonUpdate.ssn = Object.assign(new SsnEntity(), new SsnModel(req.body.ssn));
        }
        console.log(PersonUpdate);
        getMongoManager()
        .update(PersonEntity, {_id : new ObjectID(_id)} , PersonUpdate)
            .then(user => {
                return res.status(200).json(PersonUpdate);
            });
    }

    /**
     * Supprime une personne
     * La requête doit contenir l'id de la personne.
     */
    public static delete(req: Request, res: Response, next: any) {
        let filter = {_id: new ObjectID(req.params.id)}

        getMongoManager().findOneAndDelete(PersonEntity, filter)
        .then((user) => {
            if(user.value){
                return res.status(200).json();
            }
            
            res.status(404).send("User not found");
        })
    }
}