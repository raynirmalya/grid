import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Confirmation } from './confirm';

@Injectable()
export class ConfirmationService {
    private reqrConf = new Subject<Confirmation>();
    openConfirm = this.reqrConf.asObservable();
    confirm(confirmation: Confirmation) {
        this.reqrConf.next(confirmation);
        return this;
    }
}
