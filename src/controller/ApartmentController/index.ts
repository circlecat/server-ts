import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Apartment } from '../../entity/Apartment';
import Address from '../../entity/Address';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ApartmentController {
  private apartmentRepository = getRepository(Apartment);
  private addressRepository = getRepository(Address);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.apartmentRepository
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.address', 'address')
      .getMany();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.apartmentRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const apartment = plainToClass(Apartment, request.body.apartment, { excludeExtraneousValues: true });
    const address = plainToClass(Address, request.body.address, { excludeExtraneousValues: true });

    try {
      const appartmentErrors = await validate(apartment, { validationError: { target: false } });
      const addressErrors = await validate(address, { validationError: { target: false } });
      const errors = [...appartmentErrors, ...addressErrors];
      if (errors.length > 0) {
        return errors;
      }

      const isAddressExist = await this.addressRepository.findOne(address);

      if (isAddressExist) {
        response.status(400);
        return { status: 'ADDRESS_ALREADY_EXIST' };
      }

      return this.apartmentRepository.save(apartment).then(apartment => {
        address.apartment = apartment;
        return this.addressRepository.save(address);
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const apartmentToRemove = await this.apartmentRepository.findOne(request.params.id);
      if (!apartmentToRemove) {
        return;
      }
      return this.apartmentRepository.remove(apartmentToRemove);
    } catch (error) {
      next(error);
    }
  }

  async rentOut(request: Request, response: Response, next: NextFunction) {
    try {
      const apartmentToRentOut = await this.apartmentRepository.findOne(request.params.id);
      if (!apartmentToRentOut) {
        return;
      }

      if (apartmentToRentOut.isRented) {
        response.status(400);
        return { status: 'APARTMENT_ALREADY_RENTED_OUT' };
      }

      const now = new Date();
      const afterYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

      apartmentToRentOut.isRented = true;
      apartmentToRentOut.rentStartDate = now;
      apartmentToRentOut.rentEndDate = afterYear;

      return this.apartmentRepository.save(apartmentToRentOut);
    } catch (error) {
      next(error);
    }
  }

  async stopRentOut(request: Request, response: Response, next: NextFunction) {
    try {
      const apartmentToRentOut = await this.apartmentRepository.findOne(request.params.id);
      if (!apartmentToRentOut) {
        return;
      }

      if (!apartmentToRentOut.isRented) {
        response.status(400);
        return { status: 'APARTMENT_DOES_NOT_RENTED_OUT' };
      }

      const now = new Date();

      apartmentToRentOut.isRented = false;
      apartmentToRentOut.rentStartDate = null;
      apartmentToRentOut.rentEndDate = null;

      return this.apartmentRepository.save(apartmentToRentOut);
    } catch (error) {
      next(error);
    }
  }
}
