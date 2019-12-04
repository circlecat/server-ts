import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Apartment } from '../entity/Apartment';

export class ApartmentController {
  private apartmentRepository = getRepository(Apartment);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.apartmentRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.apartmentRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.apartmentRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const apartmentToRemove = await this.apartmentRepository.findOne(request.params.id);
    await this.apartmentRepository.remove(apartmentToRemove);
  }
}
