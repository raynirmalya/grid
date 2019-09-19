import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Confirmation, Comment } from './confirm';
import { ConfirmationService } from './confirm.service';
import { Subscription } from 'rxjs/Subscription';
// import { PLACEHOLDER } from '../interface/common.constants';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit, OnDestroy {
  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
  public isModalShown: Boolean = false;
  isCommentPresent: Boolean = false;
  message: string;
  iconDefault = '../../assets/image/Confirm_Delete.svg';
  icon?: string;
  header?: string;
  acceptEvent?: EventEmitter<Comment>;
  rejectEvent?: EventEmitter<Comment>;
  subscription: Subscription;
  confirmation: Confirmation;
  commentData: Comment;
  placeHolderStr = '##';

  constructor(private confirmationService: ConfirmationService, private translation: TranslationService) {
        this.subscription = confirmationService.openConfirm.subscribe(confirmation => {
                console.log('~~~~~~~~~~ confirm box called ~~~~~~~~~~');
                this.confirmation = confirmation ;
                this.message = this.changeAndLocalizeMessage(this.confirmation.message);
                // this.message = this.confirmation.message;
                if ( this.confirmation.icon) {
                    this.icon = this.confirmation.icon;
                }else {
                    this.icon = this.iconDefault;
                }
                this.isCommentPresent = this.confirmation.isCommentPresent;
                this.header = this.confirmation.header;
                this.commentData = new Comment();
                if (this.confirmation.accept) {
                    this.confirmation.acceptEvent = new EventEmitter();
                    this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
                }
                if (this.confirmation.reject) {
                    this.confirmation.rejectEvent = new EventEmitter();
                    this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
                }
                this.isModalShown = true;
        });
    }

  ngOnInit() {
  }
    countPlaceholder(str) {
        return (str.match(new RegExp(this.placeHolderStr + '' , 'g')) || []).length;
    }
    changeAndLocalizeMessage(msg) {
    // for (let i = 0; i < this.msgs.length; i++) {
       if (msg && this.confirmation.placeHolder) {
         const placeHolderCnt = this.countPlaceholder(this.translation.translate(msg));
         if ( placeHolderCnt  === this.confirmation.placeHolder.length) {
          const arr = this.translation.translate(msg).split(this.placeHolderStr);
          let finalStr: string;
          finalStr = '';
          for ( let i = 0; i < arr.length; i++ ) {
            if ( this.confirmation.placeHolder[i] ) {
              if (this.confirmation.placeHolder[i].indexOf('Confirm') !== -1) {
                 finalStr  =  finalStr + arr[i] + this.translation.translate(this.confirmation.placeHolder[i]);
              }else {
                finalStr  =  finalStr + arr[i] + this.confirmation.placeHolder[i];
              }
            }else {
              finalStr  =  finalStr + arr[i];
            }
          }
            msg = finalStr;
         } else {
            msg = this.translation.translate(msg);
           console.log('placeholder count mismatched');
         }
       }
   // }
      return msg;
    }
      accept() {
        if (this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit(this.commentData);
            this.hideModal();
        }
    }
    reject() {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit(this.commentData);
            this.hideModal();
        }
    }
      public hideModal(): void {
    this.autoShownModal.hide();
  }
  public onHidden(): void {
    this.isModalShown = false;
  }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
