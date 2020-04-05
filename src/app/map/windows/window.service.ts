import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class WindowService {
    // Observable string sources
    private emitSideChangeSource = new Subject<number>();
    private emitWindowCloseSource = new Subject<number>();

    // Observable string streams
    sideChangeEmitted$ = this.emitSideChangeSource.asObservable();
    windowCloseEmitted$ = this.emitWindowCloseSource.asObservable();

    constructor() {
    }

    // Service message commands
    emitSideChange(sideNavId: number) {
        this.emitSideChangeSource.next(sideNavId);
    }

    emitWindowClose(WinNum: number) {
        this.emitWindowCloseSource.next(WinNum);
    }

}

export class SideNavState {
    opened: boolean;
    value: number;
}
