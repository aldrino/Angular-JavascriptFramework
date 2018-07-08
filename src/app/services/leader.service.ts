import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  constructor(private restangular: Restangular) { }

  getLeaders(): Observable<Leader[]> {
    //return of(LEADERS).pipe(delay(2000));
    return this.restangular.all('leaders').getList();
  }

  getFeaturedLeader(): Observable<Leader> {
    // return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
    return this.restangular.all('leaders').getList({featured: true})
      .pipe(map(leaders => leaders[0]));
  }
}
