import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Length, IsInt, Min, Max } from 'class-validator';
import { Apartment } from './Apartment';
import { Expose } from 'class-transformer';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(2, 55)
  @Column('varchar')
  @Expose()
  city: string;

  @Length(2, 255)
  @Column('varchar')
  @Expose()
  street: string;

  @IsInt()
  @Min(0)
  @Max(10000)
  @Column('int')
  @Expose()
  houseNumber: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  @Column('int')
  @Expose()
  roomNumber: number;

  @OneToOne(
    () => Apartment,
    apartment => apartment.address,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  apartment: Apartment;
}

export default Address;
