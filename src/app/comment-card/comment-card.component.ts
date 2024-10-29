import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScoreButtonComponent } from "../score-button/score-button.component";
import { AddCommentComponent } from '../add-comment/add-comment.component';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  standalone: true,
  imports: [ScoreButtonComponent, AddCommentComponent]
})
export class CommentCardComponent {
  @Input() avatarSrc: string = '';
  @Input() username: string = '';
  @Input() createdAt: string = '';
  @Input() content: string = '';
  @Input() score: number = 0;
  @Input() isCurrentUser?: boolean = false;
  @Input() replyingTo?: string;
  @Input() isReply: boolean = false;

  @Output() reply = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();



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