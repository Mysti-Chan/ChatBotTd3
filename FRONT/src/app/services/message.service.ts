import { Injectable } from '@angular/core';
import { Message } from '../model/message.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messages: Message[];
  public messagesSubject: Subject<Message[]>;
  private event: string;

  constructor(private http: HttpClient,
              private socket: Socket) {
    this.messages = [];
    this.messagesSubject = new Subject();
    this.emitMessages();

    this.socket.fromEvent("message").subscribe((data: Message) =>{
      this.event = data.nextEvent;
      data.avatar = "https://i.pinimg.com/originals/2c/8b/ed/2c8bed2ea157922ca65cf5f4ac98d43a.png"
      this.addMessage(data);
    });
  }

  public emitMessages(){
    this.messagesSubject.next(this.messages.slice());
  }

  public sendMessage(message: Message){
    this.addMessage(message);
    this.socket.emit(this.event, message.content);
  }

  private addMessage(message: Message){
    this.messages.push(message);
    this.emitMessages();
  } 

  private deleteMessage(message: Message){
    this.messages = this.messages.filter((value) => value != message);
    this.emitMessages(); 
  }
}
