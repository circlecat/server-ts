import { ApartmentController } from './controller/ApartmentController';

export const Routes = [
  {
    method: 'get',
    route: '/apartment',
    controller: ApartmentController,
    action: 'all',
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
];
