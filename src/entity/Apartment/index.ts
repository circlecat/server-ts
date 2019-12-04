import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { IsInt, Min, Max } from 'class-validator';
import Address from '../Address';
import { Expose } from 'class-transformer';

export enum repairType {
  ECONOMY = 'economy',
  EURO = 'euro',
  LUX = 'lux',
}

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Min(0)
  @Max(10000)
  @Column('int')
  @Expose()
  @IsInt()
  area: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @Column('int')
  @Expose()
  rooms: number;

  @IsInt()
  @Min(0)
  @Max(999999999)
  @Column('int')
  @Column('int')
  @Expose()
  price: number;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @Column('int')
  @Expose()
  yearOfConstruction: number;

  @Expose()
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
