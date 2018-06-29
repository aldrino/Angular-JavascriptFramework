import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  constructor() { }

  getLeaders(): Leader[] {
    return LEADERS;
  }

  getFeaturedLeader(): Leader {
    return LEADERS.filter((leader) => leader.featured)[0];
  }
}
