import { EventEmitter } from '@angular/core';

export interface Confirmation {
    message: string;
    icon?: string;
    header?: string;
    accept?: Function;
    reject?: Function;
    isCommentPresent?: Boolean;
    acceptEvent?: EventEmitter<any>;
    rejectEvent?: EventEmitter<any>;
    placeHolder?: string [];
}

export class Comment {
    comment: string;
}
