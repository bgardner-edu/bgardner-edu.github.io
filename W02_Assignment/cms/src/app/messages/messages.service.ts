import { EventEmitter, Injectable } from "@angular/core";
import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class MessageService {
    baseURL = 'http://localhost:3000/message';
    messages: Message[] = [];
    maxMessageId: number;
    messageChangedEvent = new Subject<Message[]>();

    constructor(private http: HttpClient) {
        this.maxMessageId = this.getMaxId();
    }

    getMessages() {
        this.http.get<{message: string, messages: Message[] }>(this.baseURL).subscribe(
            (responseData) => {
                this.messages = responseData.messages;
                this.maxMessageId = this.getMaxId();
                this.messages.sort((a, b) => (a.id < b.id) ? -1 : 1);
                this.messageChangedEvent.next(this.messages.slice());
            },
            (error: any) => {
                console.error(error);
            }
        );
        return this.messages.slice();
    }

    getMessage(id: string) {
        for (let message of this.messages) {
            if (message.id === id) {
                return message;
            }
        }
        return null;
    }

    addMessage(message: Message) {
        if (!message) {
            return;
          }
      
          // make sure id of the new Document is empty
          message.id = '';
      
          const headers = new HttpHeaders({'Content-Type': 'application/json'});
      
          // add to database
          this.http.post<{ message: string, resMessage: Message }>('http://localhost:3000/message',
            document,
            { headers: headers })
            .subscribe(
              (responseData) => {
                // add new document to documents
                this.messages.push(responseData.resMessage);
                this.messageChangedEvent.next(this.messages.slice());
              }
            );
        }

    storeMessages() {
        let messages = JSON.stringify(this.messages);
        this.http.put(this.baseURL, messages, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }).subscribe(() => {
            this.messageChangedEvent.next(this.messages.slice());
        });
    }

    sortAndSend() {
        this.messages.sort((a, b) => (a.sender < b.sender) ? -1 : 1);
        this.messageChangedEvent.next(this.messages.slice());
    }

    getMaxId(): number {
        let maxId = 0;
        for (let message of this.messages) {
            let currentId = parseInt(message.id);
            if (currentId > maxId) {
                maxId = currentId;
            }
        }
        return maxId;
    }
}