import { Breed } from "../../breeds/entities/breed.entity";
import { User } from "../../users/entities/user.entity";
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  
  @Entity()
  export class Cat {
    @PrimaryGeneratedColumn()
    @Column({ primary:true, generated:true })
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    age: number;
  
    @ManyToOne(() => Breed, (breed) => breed.id, { 
      // cascade: true,
      eager: true, // para que traiga las raza al hacer un findOne
    })
    breed: Breed;
  
    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email',  })
    user: User;

    @Column()
    userEmail: string;
  }