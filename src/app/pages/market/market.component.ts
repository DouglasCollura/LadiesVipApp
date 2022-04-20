import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})
export class MarketComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  display_market:boolean=false;
  display_res:boolean=true;

}
