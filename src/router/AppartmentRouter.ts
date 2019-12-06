import { ApartmentController } from '../controller/ApartmentController/ApartmentController';

export const AppartmentRoutes = [
  {
    method: 'get',
    route: '/apartment/get-repair-type',
    controller: ApartmentController,
    action: 'getRepairType',
  },
  {
    method: 'get',
    route: '/apartment',
    controller: ApartmentController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/apartment/free',
    controller: ApartmentController,
    action: 'allFree',
  },
  {
    method: 'get',
    route: '/apartment/rented',
    controller: ApartmentController,
    action: 'allRented',
  },
  {
    method: 'get',
    route: '/apartment/:id',
    controller: ApartmentController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/apartment',
    controller: ApartmentController,
    action: 'save',
  },
  {
    method: 'delete',
    route: '/apartment/:id',
    controller: ApartmentController,
    action: 'remove',
  },
  {
    method: 'get',
    route: '/apartment/rent-out/:id',
    controller: ApartmentController,
    action: 'rentOut',
  },
  {
    method: 'get',
    route: '/apartment/stop-rent-out/:id',
    controller: ApartmentController,
    action: 'stopRentOut',
  },
];
