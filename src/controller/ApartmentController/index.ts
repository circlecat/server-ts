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
    return this.apartmentRepository.find();
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
}
