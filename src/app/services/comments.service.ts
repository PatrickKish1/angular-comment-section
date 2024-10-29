import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, retry } from 'rxjs';
import { CommentInterface, Reply } from '../comment.interface';
import { isPlatformBrowser } from '@angular/common';
import commentData from '../../../public/assets/data.json'

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private comments: CommentInterface[] = [];
  private commentsSubject = new BehaviorSubject<CommentInterface[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadInitialData();
  }

  getComments(): Observable<CommentInterface[]> {
    return this.commentsSubject.asObservable();
  }


  private loadInitialData(): void {
    if (this.isBrowser) {
      const storedComments = localStorage.getItem('comments');
       if (storedComments) {
        this.comments = JSON.parse(storedComments);
      } else {
        this.comments = [...commentData.comments];
        this.saveToStorage();
      }

      const storedScores = localStorage.getItem('scores');
      if (storedScores) {
        this.applyStoredScores(JSON.parse(storedScores));
      }
    }
    this.commentsSubject.next(this.comments);
  }


  private applyStoredScores(scores: { [key: string]: number }): void {
    this.comments.forEach(comment => {
      const commentScore = scores[`comment-${comment.id}`];
      if (commentScore !== undefined) {
        comment.score = commentScore;
      }
      comment.replies?.forEach(reply => {
        const replyScore = scores[`reply-${reply.id}`];
        if (replyScore !== undefined) {
          reply.score = replyScore;
        }
      });
    });
  }

  private saveToStorage(): void {
    if (!this.isBrowser) return;

    localStorage.setItem('comments', JSON.stringify(this.comments));
    
    const scores: { [key: string]: number } = {};
    this.comments.forEach(comment => {
      scores[`comment-${comment.id}`] = comment.score;
      comment.replies?.forEach(reply => {
        scores[`reply-${reply.id}`] = reply.score;
      });
    });
    localStorage.setItem('scores', JSON.stringify(scores));
  }

  addComment(content: string, currentUser: { username: string; avatar: string }): void {
    const newComment: CommentInterface = {
      id: this.generateCommentId(),
      username: currentUser.username,
      avatar: currentUser.avatar,
      content,
      createdAt: 'Just now',
      score: 0,
      isCurrentUser: true,
      replies: []
    };

    this.comments.push(newComment);
    this.updateComments();
  }

  addReply(commentId: number, content: string, currentUser: { username: string; avatar: string }, replyingToReplyId?: number): void {
    const parentComment = this.comments.find(c => c.id === commentId);
    if (parentComment) {
      const newReply: Reply = {
        id: this.generateReplyId(parentComment),
        username: currentUser.username,
        avatar: currentUser.avatar,
        content,
        createdAt: 'Just now',
        score: 0,
        isCurrentUser: true,
        replyingTo: replyingToReplyId ? 
          parentComment.replies?.find(r => r.id === replyingToReplyId)?.username :
          parentComment.username
      };

      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.push(newReply);
      this.updateComments();
    }
  }

  updateScore(type: 'comment' | 'reply', id: number, newScore: number): void {
    if (type === 'comment') {
      const comment = this.comments.find(c => c.id === id);
      if (comment) {
        comment.score = newScore;
      }
    } else {
      this.comments.forEach(comment => {
        const reply = comment.replies?.find(r => r.id === id);
        if (reply) {
          reply.score = newScore;
        }
      });
    }
    this.updateComments();
  }

  updateContent(type: 'comment' | 'reply', commentId: number, content: string, replyId?: number): void {
    if (type === 'comment') {
      const comment = this.comments.find(c => c.id === commentId);
      if (comment) {
        comment.content = content;
      }
    } else if (replyId) {
      const comment = this.comments.find(c => c.id === commentId);
      const reply = comment?.replies?.find(r => r.id === replyId);
      if (reply) {
        reply.content = content;
      }
    }
    this.updateComments();
  }

  deleteComment(commentId: number): void {
    this.comments = this.comments.filter(c => c.id !== commentId);
    this.updateComments();
  }

  deleteReply(commentId: number, replyId: number): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment && comment.replies) {
      comment.replies = comment.replies.filter(r => r.id !== replyId);
      this.updateComments();
    }
  }

  private updateComments(): void {
    this.commentsSubject.next(this.comments);
    this.saveToStorage();
  }

  private generateCommentId(): number {
    return this.comments.length ? Math.max(...this.comments.map(c => c.id)) + 1 : 1;
  }

  private generateReplyId(comment: CommentInterface): number {
    return comment.replies?.length ? Math.max(...comment.replies.map(r => r.id)) + 1 : 1;
  }
}