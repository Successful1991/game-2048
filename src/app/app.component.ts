import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public places: any[] = [2, '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  constructor() {}
  ngOnInit() {
    this.addNumber();
  }

  addNumber() {
    const number = this.random(1, 2) * 2;
    const index = (this.random(1, 16) - 1);
    this.searchEmptyCell(index, number);
  }
  searchEmptyCell(indexNewNumber, number) {
    const emptyCell = this.places.indexOf('');
    if (emptyCell === -1) {
      console.log('GAME over');
    } else if (this.places[indexNewNumber] === '') {
      this.places[indexNewNumber] = number;
    } else if (this.places[indexNewNumber] !== '' && indexNewNumber < this.places.length - 1 ) {
      indexNewNumber -= 1;
      this.searchEmptyCell(indexNewNumber, number);
    } else {
      indexNewNumber += 1;
      this.searchEmptyCell(indexNewNumber, number);
    }
  }
  random(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
  }

  swipe(action) {
    alert(action);
  }
  // swipe(e) {
  //   console.log(e);
  // }
}
