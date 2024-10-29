import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-score-button',
  standalone: true,
  imports: [],
  templateUrl: './score-button.component.html',
  styleUrl: './score-button.component.css'
})
export class ScoreButtonComponent {
  @Input() score: number = 0;
  @Output() scoreChange = new EventEmitter<number>();
  
  currentScore: number = 0;
  lastAction: 'upvote' | 'downvote' | null = null;

  ngOnInit() {
    this.currentScore = this.score;
  }

  upvote() {
    if (this.lastAction !== 'upvote') {
      this.currentScore += 1;
      this.lastAction = 'upvote';
      this.scoreChange.emit(this.currentScore);
    }
  }

  downvote() {
    if (this.lastAction !== 'downvote') {
      if (this.currentScore !== 0) {
        this.currentScore -= 1;
        this.lastAction = 'downvote';
        this.scoreChange.emit(this.currentScore);
      }
    }
  }
  
  isUpvoteDisabled(): boolean {
    return this.lastAction === 'upvote';
  }

  isDownvoteDisabled(): boolean {
    return this.lastAction === 'downvote';
  }
}