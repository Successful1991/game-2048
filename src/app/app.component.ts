import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public placesDefault: any[] = [
    [2, '', '', ''],
    ['', '', '' , ''],
    ['', '' , '' , '' ],
    ['', '', '' , '']
  ];
  public places: any[] = this.placesDefault;

  public pl = {
    0: {x: 0, y: -1}, // up
    1: {x: 1, y: 0}, // right
    2: {x: 0, y: 1}, // down
    3: {x: -1, y: 0} // left
  };
  public repeat = false;
  public cellsConnect = false;
  public numberAdded = false;
  public win = false;
  public clickActive = false;
  public indexAddNumber = {x: 0, y: 0};

  constructor() {}
  ngOnInit() {
    this.addNumber();

    document.addEventListener('keydown', (e) => {
      if (!this.clickActive && e.keyCode === 37 || e.keyCode === 100 ) { // left
          this.clickLimit();
          this.swipe(3);
      } else if (!this.clickActive && e.keyCode === 38 || e.keyCode === 104) { // up
          this.clickLimit();
          this.swipe(0);
      } else if (!this.clickActive && e.keyCode === 39 || e.keyCode === 102) { // right
          this.clickLimit();
          this.swipe(1);
      } else if (!this.clickActive && e.keyCode === 40 || e.keyCode === 98) { // down
          this.clickLimit();
          this.swipe(2);
      }
    });
  }


  addNumber() {
    const number = Math.random() < 0.8 ? 2 : 4;
    const index = (this.random(1, 16) - 1);
    return this.searchEmptyCell(index, number);
  }

  clickLimit() {
    this.clickActive = true;
    setTimeout(() => { this.clickActive = false; }, 200);
  }

  cells(position) {
    return position.x >= 0 && position.x < this.places.length &&
           position.y >= 0 && position.y < this.places.length;
  }

  checkFreeCells() {
    for (let i = 0; i < this.places.length; i++ ) {
      if (this.places[i].indexOf('') >= 0) {
        return this.places[i].indexOf('') + (i * 4);
      }
    }
    return -1;
  }

  searchEmptyCell(indexNewNumber, number) {
    const x = Math.floor(indexNewNumber / 4 );
    let y = ((indexNewNumber + 1) % 4) === 0 ? 3 : (indexNewNumber + 1) % 4 - 1;

    if ( this.places[x][y] === '') {
      this.places[x][y] = number;
      return {y: y, x: x};
    } else if (this.places[x][y] !== '' && y > 0 ) {
      y -= 1;
      return this.searchEmptyCell(y, number);
    } else {
      return this.searchEmptyCell( this.checkFreeCells() , number);
    }
  }

  filterEmptyElem(next, act) {
    this.repeat = false;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        this.filterElem(y, x, next, act);
      }
    }

    if (this.repeat) {
      this.filterEmptyElem(next, act);
    }
  }

  filterEmptyElemReverse(next, act) {
    this.repeat = false;
    for (let y = 3; y >= 0; y--) {
      for (let x = 3; x >= 0; x--) {
        this.filterElem(y, x, next, act);
      }
    }

    if (this.repeat) {
      this.filterEmptyElemReverse(next, act);
    }
  }


  filterElem(y, x, next, act) {
    const tile = this.cells({y: y, x: x});

    if (tile) {
      const other = {y: y + next.y, x: x + next.x};
      const cell = this.cells(other);
      act.call(this, y, x, next, cell);
    }

  }

  cellTransition(y, x, next, cell) {
    if (cell && this.places[y][x] && !this.places[y + next.y][x + next.x]) {

      this.places[y + next.y][x + next.x] = this.places[y][x];
      this.places[y][x] = '';
      this.repeat = true;
      this.numberAdded = true;

    } else if (cell && this.places[y][x] === this.places[y + next.y][x + next.x] ) {

      this.cellsConnect = true;
    }
  }

  cellConnect(y, x, next, cell) {
    if (
      cell &&
      this.places[y][x] &&
      this.places[y][x] === this.places[y + next.y][x + next.x]
    ) {
      this.places[y + next.y][x + next.x] += this.places[y][x];
      this.places[y][x] = '';
      this.numberAdded = true;
    }
    if (cell && this.places[y + next.y][x + next.x] === 2048) {
      this.win = true;
    }
  }

  random(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
  }

  swipe( action ) {
    this.numberAdded = false;

    if (action === 0 || action === 3) {
      this.filterEmptyElem(this.pl[action], this.cellTransition);
      if (this.cellsConnect) {
        this.filterEmptyElem(this.pl[action], this.cellConnect);
        this.filterEmptyElem(this.pl[action], this.cellTransition);
      }
    } else {
      this.filterEmptyElemReverse(this.pl[action], this.cellTransition);
      if (this.cellsConnect) {
        this.filterEmptyElemReverse(this.pl[action], this.cellConnect);
        this.filterEmptyElemReverse(this.pl[action], this.cellTransition);
      }
    }

    if (this.win) {
      this.victory( );
    } else if (this.numberAdded) {
      this.indexAddNumber = this.addNumber();
    }
    if (this.checkFreeCells() === -1 && !this.checkMoves(this.indexAddNumber, this.pl) ) {
      this.timerNewGame();
    }

   }

  timerNewGame() {
    let time = 3;
    const over: HTMLElement = document.getElementsByClassName('gameOver__bg')[0] as HTMLElement;
    over.style.display = 'flex';
    myTimerfunc.call(this);

    function myTimerfunc () {
      setTimeout(t.bind(this), 1000);
    }

    function t() {
      time -= 1;
      document.getElementsByClassName('newGameTime')[0].innerHTML = (time.toString());
      if (time < 0) {
        over.style.display = 'none';
        this.places = this.placesDefault;
      } else {
        myTimerfunc.call(this);
      }
    }
  }

  checkMoves(el, pl) {
    for (let i = 0; i < 4; i++) {
      for ( let j = 0; j < 4; j++) {
        if (
          this.cells({y: el.y + pl[i].y, x: el.x + pl[i].x}) &&
          this.places[i][j] === this.places[i][j + 1] ||
          ( i < 3 && this.places[i][j] === this.places[i + 1][j] )
        ) {
          return true;
        } else if (i === 3 && this.places[i][j] === this.places[i][j + 1]) {
          return true;
        }
      }
  }
    return false;
  }

   victory() {
    console.log('you victory');
   }

}
