import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Apartment } from '../../entity/Apartment';
import Address from '../../entity/Address';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import status from '../../statuses';

export class ApartmentController {
  private apartmentRepository = getRepository(Apartment);
  private addressRepository = getRepository(Address);

  async all(request: Request, response: Response) {
    const res = await this.apartmentRepository
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.address', 'address')
      .getMany();
    return response.json(res);
  }

  async allRented(request: Request, response: Response) {
    const res = await this.apartmentRepository
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.address', 'address')
      .where('apartment.isRented = true')
      .getMany();
    return response.json(res);
  }

  async allFree(request: Request, response: Response) {
    const res = await this.apartmentRepository
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.address', 'address')
      .where('apartment.isRented = false')
      .getMany();
    return response.json(res);
  }

  async one(request: Request, response: Response) {
    const res = await this.apartmentRepository
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.address', 'address')
      .whereInIds(request.params.id)
      .getOne();

    if (!res) {
      return response.status(status.REQEST_PARAMS_ERROR.statusCode).send(status.REQEST_PARAMS_ERROR.text);
    }

    return response.json(res);
  }

  async save(request: Request, response: Response) {
    const apartment = plainToClass(Apartment, request.body.apartment, { excludeExtraneousValues: true });
    const address = plainToClass(Address, request.body.address, { excludeExtraneousValues: true });

    const appartmentErrors = await validate(apartment, { validationError: { target: false } });
    const addressErrors = await validate(address, { validationError: { target: false } });
    const errors = [...appartmentErrors, ...addressErrors];
    if (errors.length > 0) {
      return response.status(422).json(errors);
    }

    const isAddressExist = await this.addressRepository.findOne(address);

    if (isAddressExist) {
      return response.status(status.ADDRESS_ALREADY_EXIST.statusCode).send(status.ADDRESS_ALREADY_EXIST.text);
    }

    const apartmentRes = await this.apartmentRepository.save(apartment);
    address.apartment = apartmentRes;
    await this.addressRepository.save(address);

    return response.send();
  }

  async remove(request: Request, response: Response) {
    const apartmentToRemove = await this.apartmentRepository.findOne(request.params.id);
    if (!apartmentToRemove) {
      return response.status(status.REQEST_PARAMS_ERROR.statusCode).send(status.REQEST_PARAMS_ERROR.text);
    }
    await this.apartmentRepository.remove(apartmentToRemove);
    return response.send();
  }

  async rentOut(request: Request, response: Response) {
    const apartmentToRentOut = await this.apartmentRepository.findOne(request.params.id);
    if (!apartmentToRentOut) {
      return response.status(status.REQEST_PARAMS_ERROR.statusCode).send(status.REQEST_PARAMS_ERROR.text);
    }

    if (apartmentToRentOut.isRented) {
      return response.status(status.ADDRESS_ALREADY_EXIST.statusCode).send(status.ADDRESS_ALREADY_EXIST.text);
    }

    const now = new Date();
    const afterYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    apartmentToRentOut.isRented = true;
    apartmentToRentOut.rentStartDate = now;
    apartmentToRentOut.rentEndDate = afterYear;

    await this.apartmentRepository.save(apartmentToRentOut);
    return response.send();
  }

  async stopRentOut(request: Request, response: Response) {
    const apartmentToRentOut = await this.apartmentRepository.findOne(request.params.id);
    if (!apartmentToRentOut) {
      return response.status(status.REQEST_PARAMS_ERROR.statusCode).send(status.REQEST_PARAMS_ERROR.text);
    }

    if (!apartmentToRentOut.isRented) {
      return response.status(status.NOT_RENTED_OUT.statusCode).send(status.NOT_RENTED_OUT.text);
    }

    apartmentToRentOut.isRented = false;
    apartmentToRentOut.rentStartDate = null;
    apartmentToRentOut.rentEndDate = null;

    await this.apartmentRepository.save(apartmentToRentOut);

    response.send();
  }
}
