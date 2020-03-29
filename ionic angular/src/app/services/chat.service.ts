import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
 username= 'abdoccc';
 room = 'giza'
  constructor(private socket: Socket) { 

  }
 userVisitChatPage(){
   this.socket.emit('userVisitChatPage')
 }
  sendMessage(msg: string){
      this.socket.emit("clientSendMsg", msg,(message)=>{
        console.log("Server acknowledegement " + message)
      });
  }
   getMessage():Observable<any> {
         return new Observable((observer)=>{
          this.socket.on('serverSendMsg',(data)=>{
            console.log(data)
            observer.next(data)
         })  ;
      });
  }
}
