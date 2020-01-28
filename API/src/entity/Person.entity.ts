import { SsnEntity } from "./Ssn.entity";
import {
    Column,
    Entity,
    ObjectIdColumn,
} from "typeorm";
import {ObjectID} from "mongodb";

@Entity("Person")
export class PersonEntity{

    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    public name: string;

    @Column()
    public lastname: string;

    @Column(type => SsnEntity)
    public ssn: SsnEntity;
}