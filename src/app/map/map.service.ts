import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { v34 } from '../../api/ApiKmv/v34';


@Injectable()
export class MapService {
    // Observable string sources
    private emitCompanyFilterSource = new Subject<v34[]>();
    private emitDrawerDetailClickSource = new Subject<number[]>();

    // Observable string streams
    companyFilterEmitted$ = this.emitCompanyFilterSource.asObservable();
    drawerDetailClickEmitted$ = this.emitDrawerDetailClickSource.asObservable();

    constructor() {
    }

    // Service message commands
    emitCompanyFilter(data: v34[]) {
        this.emitCompanyFilterSource.next(data);
    }

    emitDrawerDetailClick(data: number[]) {
        this.emitDrawerDetailClickSource.next(data);
    }
}

