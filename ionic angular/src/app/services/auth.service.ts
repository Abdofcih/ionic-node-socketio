import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


interface AppUser{
    username:string,
    room: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $userObs:BehaviorSubject<AppUser> ;
  constructor(public  router:  Router,private socket: Socket) { 
    let user = JSON.parse(localStorage.getItem('user'));
    if(user)
    {
     this.$userObs = new BehaviorSubject<AppUser>(user);
     this.joinRoom(user)
    }
    else{
     this.$userObs = new BehaviorSubject<AppUser>(null);
    }

 
  }

  login(username,room){
     let user:AppUser = {username,room}
     localStorage.setItem('user', JSON.stringify(user));
     this.$userObs.next(user)
     this.joinRoom(user)
     this.router.navigate(['/game']);
  }



   joinRoom(user){
    this.socket.emit('join',{username:user.username, room:user.room} ,(error)=>{
      if(error)
       {
         localStorage.clear()
         alert(error)
         location.href = '/login'
       }
    })
   }

   leave(){
     localStorage.removeItem('user')
     this.socket.emit('disconnect');
   }
}
