import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScoreButtonComponent } from '../score-button/score-button.component';

@Component({
  selector: 'app-reply-card',
  templateUrl: './reply-card.component.html',
  standalone: true,
  imports: [ScoreButtonComponent]
})
export class ReplyCardComponent {

  @Input() avatarSrc: string = '';
  @Input() username: string = '';
  @Input() createdAt: string = '';
  @Input() content: string = '';
  @Input() score: number = 0;
  @Input() isCurrentUser: boolean = false;
  @Input() replyingTo?: string;

  @Output() reply = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
comment: any;

  onReply(): void {
    this.reply.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}