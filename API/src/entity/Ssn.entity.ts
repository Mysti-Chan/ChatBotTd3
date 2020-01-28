import {Column} from "typeorm";

export class SsnEntity{
    
    @Column()
    public ssn: string;

    @Column()
    public genre: number;

    @Column()
    public annee: number;

    @Column()
    public mois: number;

    @Column()
    public departement: number;

    @Column()
    public departementNom: string;

    @Column()
    public ville: number;

    @Column()
    public pays: number;

    @Column()
    public villeNom: string;

    @Column()
    public certificat: number;

    @Column()
    public clef: number;

    @Column()
    public keyvalable: boolean;

    @Column()
    public valable: boolean
}