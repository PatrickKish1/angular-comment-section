export interface CommentInterface {
    id: number;
    username: string;
    avatar: string;
    content: string;
    createdAt: string;
    score: number;
    isCurrentUser: boolean;
    replies?: Reply[];
  }


export interface Reply {
    id: number;
    username: string;
    avatar: string;
    content: string;
    createdAt: string;
    score: number;
    isCurrentUser: boolean;
    replyingTo?: string;
    replies?: Reply[]
}

