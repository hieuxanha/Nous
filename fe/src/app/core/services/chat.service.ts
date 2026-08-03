import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/chat';

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${this.API_URL}/send`, { message });
  }
}