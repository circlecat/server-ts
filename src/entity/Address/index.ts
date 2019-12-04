import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Length, IsInt, Min, Max } from 'class-validator';
import { Apartment } from '../Apartment';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(2, 55)
  @Column('varchar')
  city: string;

  @Length(2, 255)
  @Column('varchar')
  street: string;

  @IsInt()
  @Min(0)
  @Max(10000)
  @Column('int')
  houseNumber: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  @Column('int')
  roomNumber: number;

  @OneToOne(() => Apartment, {
    cascade: true,
  })
  @JoinColumn()
  apartment: Apartment;
}

export default Address;
