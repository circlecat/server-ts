import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { IsInt, Min, Max } from 'class-validator';
import Address from '../Address';

export enum repairType {
  ECONOMY = 'economy',
  EURO = 'euro',
  LUX = 'lux',
}

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Min(0)
  @Max(100000)
  @Column('int')
  area: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  @Column('int')
  rooms: number;

  @IsInt()
  @Min(0)
  @Max(999999999)
  @Column('int')
  @Column('int')
  price: number;

  @IsInt()
  @Min(1)
  @Max(new Date().getFullYear())
  @Column('int')
  yearOfConstruction: number;

  @Column({
    type: 'enum',
    enum: repairType,
    default: repairType.ECONOMY,
  })
  repairType: repairType;

  @OneToOne(
    () => Address,
    app => app.apartment,
  )
  address: Address;

  @Column('bool', {
    default: false,
  })
  isRented: boolean;

  @Column('date', {
    default: null,
  })
  rentStartDate: Date;

  @Column('date', {
    default: null,
  })
  rentEndDate: Date;
}
