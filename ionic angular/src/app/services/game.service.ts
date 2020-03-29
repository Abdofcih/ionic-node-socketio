import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private socket: Socket) { }

  getRoomData():Observable<any>{
    return new Observable((observer)=>{
      this.socket.on('roomData',(data)=>{
        console.log(data)
      })
    })
  }
  sendTurnResult(player, index){
    this.socket.emit("sendTurnResult", {player, index},(message)=>{
      console.log("Server acknowledegement " + message)
    });
}
  getTurnResult():Observable<any> {
       return new Observable((observer)=>{
        this.socket.on('sendTurnResult',(data)=>{
          observer.next(data)
       })  ;
    });
}
}
