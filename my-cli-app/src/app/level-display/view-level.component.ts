/**
 * Created by aRTie on 28/10/2017.
 */


import { Component, OnInit } from '@angular/core';
import {WebService} from '../services/web.service';
// import { ReleaseNotesComponent } from './release-notes/release-notes.component';

@Component({
  selector: 'view-level',
  templateUrl: `./view-level.component.html`,

})
export class LevelViewComponent implements OnInit  {

  map;
  player;
  tiles;
  tilesIndex;
  isLoading;

  constructor(
    private webSer: WebService,
  ) {
    this.isLoading = true;
    this.tilesIndex = [];
  }



  ngOnInit() {
    this.webSer.loadFirstLevel().subscribe(result => {
      this.map = result.mapData.tiles;
      this.tiles = result.tileData.rows;
      this.player = result.playerData;

      this.tilesIndex = this.tiles.map(oneTile => oneTile.id);
      console.log(this.tiles);
      this.isLoading = false;
    });

  }







}
