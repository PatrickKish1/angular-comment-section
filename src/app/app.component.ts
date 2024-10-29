// app.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddCommentComponent } from "./add-comment/add-comment.component";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [FormsModule, AddCommentComponent]
})
export class AppComponent {
  
}