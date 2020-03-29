import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GameService } from '../services/game.service';
import { AuthService } from '../services/auth.service';




@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})


export class GamePage implements OnInit { 
    myTurn:Boolean;
    circleTurn: boolean;
    cellElements;
    X_CLASS = 'x';
    CIRCLE_CLASS = 'circle';
    WINNING_COMBINATIONS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
      ];
    BOARD = [
          '0', '1', '2',
          '3', '4', '5',
          '6', '7', '8',
    ];
  constructor(private alertController: AlertController,
              private gameService: GameService,
              private authService: AuthService) { }

  ngOnInit() {
     this.startGame();

     this.gameService.getTurnResult().subscribe((data)=>{
       if(data.username === this.authService.$userObs.value.username)
         this.myTurn = false;
       else
       this.myTurn = true;
       this.handleClickEmplentation(data.index)
     })
  }
   startGame() {
     this.myTurn = true;
      this.circleTurn = false;

      //reset Board Array
      this.BOARD.forEach((cell,i) => {
        this.BOARD[i] = i.toString();
      });

      // reset Board squers
      this.cellElements = document.querySelectorAll('[data-cell]');
      this.cellElements.forEach(cell => {
        cell.classList.remove(this.X_CLASS);
        cell.classList.remove(this.CIRCLE_CLASS);
      });
  }

   handleClick(i) {
    if (this.BOARD[i]=== this.X_CLASS|| this.BOARD[i]===this.X_CLASS) {
      return;
   }
   if(!this.myTurn)
    return;
     this.gameService.sendTurnResult("abdo",i)
  }

  handleClickEmplentation(i){


    let currentClass = this.circleTurn ? this.CIRCLE_CLASS : this.X_CLASS;

    this.BOARD[i] = currentClass;
   
    

    if (this.checkWin(currentClass)) {
      this.endGameMessage(false);
    } else if (this.isDraw()) {
      this.endGameMessage(true);
    } else {
      this.swapTurns();
    }
  }


   isDraw() {
     // if no one wins and  the board is completed  then it is a draw
    return this.BOARD.every(cell => {
        return cell === this.X_CLASS || cell === this.CIRCLE_CLASS;
    });
  }

   swapTurns() {
    this.circleTurn = !this.circleTurn;

  }


 checkWin(currentClass) {
    // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
    // It returns a Boolean value.
    return this.WINNING_COMBINATIONS.some(combination => {
      // The every() method tests whether all elements in the array pass the test implemented by the provided function
      // It returns a Boolean value.
      return combination.every(index => {
        return this.BOARD[index]==currentClass;
      });
    });
  }

  leave(){
    this.authService.leave()
  }

  async endGameMessage(draw) {
    let text;
    draw ? text = 'Draw!' : text = `${this.circleTurn ? "O's" : "X's"} Wins!`;
    const alert = await this.alertController.create({
      header: text,
      message: "Good game",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
        }
      },
       {
          text: 'Restart',
          handler: () => {
            this.startGame();
            console.log('Game Started');
          }
       }
      ]
    });

    await alert.present();
  }

}
