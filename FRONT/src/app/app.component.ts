import { Component, ViewChild } from '@angular/core';
import { MessageService } from './services/message.service';
import { Message } from './model/message.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'frontTd3';
  public messages: Message[];
  private messageSubscription: Subscription;
  public messageForm: FormGroup;
  @ViewChild('messagesContainer', {static: false}) messagesContainer;

  constructor(private messageService: MessageService){
    this.messageSubscription = new Subscription();
    this.messageForm = new FormGroup({
      content: new FormControl('')
    });
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.messageSubscription = this.messageService.messagesSubject.subscribe((data) => this.messages = data);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom(); 
  }

  onSubmitForm(){
    let value = this.messageForm.value;
    let message = new Message("user", value["content"])
    message.avatar = "https://www.w3schools.com/w3images/avatar6.png";
    this.messageService.sendMessage(message);
    this.messageForm.reset();
    
  }

  scrollToBottom(): void {
    try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}
}
