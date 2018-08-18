import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { v34 } from '../ApiKmv/v34';


@Injectable()
export class MapService {
    // Observable string sources
    private emitCompanyFilterSource = new Subject<v34[]>();    

    // Observable string streams
    CompanyFilterEmitted$ = this.emitCompanyFilterSource.asObservable();    

    constructor() {
    }

    // Service message commands
    emitCompanyFilter(data: v34[]) {
        this.emitCompanyFilterSource.next(data);
    }
}

