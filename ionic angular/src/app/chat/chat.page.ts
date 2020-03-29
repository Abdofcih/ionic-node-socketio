import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from '../model/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  message;
  messages:Message[] = [];
    constructor(private chatService:ChatService) { }
  
    ngOnInit() {
      this.chatService.userVisitChatPage()
      // I did not unsubscribe as I have one main job and  it would be done when user close the application 
      this.chatService.getMessage().subscribe((data:Message)=>{
        this.messages.push(data)
        console.log("server send " + data.text)
      })
    }
    addMessage(){
     
     this.chatService.sendMessage(this.message)
     let  $messages = document.querySelector('#chat__main');
     $messages.scrollTop = $messages.scrollHeight
   }

}
