import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommentInterface } from '../comment.interface';
import { CommentsService } from '../services/comments.service';
import { CommentCardComponent } from "../comment-card/comment-card.component";
import { ScoreButtonComponent } from "../score-button/score-button.component";
import { ReplyCardComponent } from "../reply-card/reply-card.component";
import commentsData from '../../../public/assets/data.json';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  standalone: true,
  imports: [FormsModule, CommentCardComponent, ScoreButtonComponent, ReplyCardComponent]
})
export class AddCommentComponent implements OnInit, OnDestroy {
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild('replyInput') replyInput!: ElementRef;

  private subscription: Subscription = new Subscription();

  currentUser = commentsData.currentUser;

  comments: CommentInterface[] = [];
  replyingToComment: number | null = null;
  replyingToReply: { commentId: number; replyId: number } | null = null;
  editingCommentId: number | null = null;
  editingReplyInfo: { commentId: number; replyId: number } | null = null;
  editContent: string = '';
  showDeleteDialog = false;
  deletingItemInfo: { type: 'comment' | 'reply'; commentId: number; replyId?: number } | null = null;
  newCommentContent = '';
  newReplyContent = '';

  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.commentsService.getComments().subscribe(comments => {
        this.comments = comments;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleReply(commentId: number, replyId?: number): void {
    if (replyId !== undefined) {
      this.replyingToReply = this.replyingToReply?.commentId === commentId && 
        this.replyingToReply?.replyId === replyId ? null : 
        { commentId, replyId };
      this.replyingToComment = null;
    } else {
      this.replyingToComment = this.replyingToComment === commentId ? null : commentId;
      this.replyingToReply = null;
    }
    this.newReplyContent = '';
    
    setTimeout(() => {
      if (this.replyInput) {
        this.replyInput.nativeElement.focus();
      }
    });
  }

  addComment(value: string): void {
    if (value.trim()) {
      this.commentsService.addComment(value.trim(), this.currentUser);
      this.newCommentContent = '';
      if (this.commentInput) {
        this.commentInput.nativeElement.focus();
      }
    }
  }

  addReply(commentId: number, value: string, replyingToReplyId?: number): void {
    if (value.trim()) {
      this.commentsService.addReply(commentId, value.trim(), this.currentUser, replyingToReplyId);
      this.newReplyContent = '';
      this.replyingToComment = null;
      this.replyingToReply = null;
    }
  }

  showDeleteConfirmation(type: 'comment' | 'reply', commentId: number, replyId?: number): void {
    this.deletingItemInfo = { type, commentId, replyId };
    this.showDeleteDialog = true;
  }

  handleDeleteConfirmation(confirmed: boolean): void {
    if (confirmed && this.deletingItemInfo) {
      if (this.deletingItemInfo.type === 'comment') {
        this.commentsService.deleteComment(this.deletingItemInfo.commentId);
      } else if (this.deletingItemInfo.replyId) {
        this.commentsService.deleteReply(this.deletingItemInfo.commentId, this.deletingItemInfo.replyId);
      }
    }
    this.showDeleteDialog = false;
    this.deletingItemInfo = null;
  }

  startEditing(commentId: number, replyId?: number): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (replyId !== undefined) {
      const reply = comment.replies?.find(r => r.id === replyId);
      if (reply) {
        this.editingReplyInfo = { commentId, replyId };
        this.editContent = reply.content;
        this.editingCommentId = null;
      }
    } else {
      this.editingCommentId = commentId;
      this.editContent = comment.content;
      this.editingReplyInfo = null;
    }
  }

  cancelEditing(): void {
    this.editingCommentId = null;
    this.editingReplyInfo = null;
    this.editContent = '';
  }

  updateContent(): void {
    const trimmedContent = this.editContent.trim();
    if (!trimmedContent) return;

    if (this.editingCommentId !== null) {
      this.commentsService.updateContent('comment', this.editingCommentId, trimmedContent);
    } else if (this.editingReplyInfo !== null) {
      this.commentsService.updateContent(
        'reply',
        this.editingReplyInfo.commentId,
        trimmedContent,
        this.editingReplyInfo.replyId
      );
    }
    this.cancelEditing();
  }

  updateScore(type: 'comment' | 'reply', id: number, newScore: number): void {
    this.commentsService.updateScore(type, id, newScore);
  }
}