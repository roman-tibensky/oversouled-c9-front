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

  mapBase;
  mapLive;
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
      this.mapBase = result.mapData.tiles;
      this.mapLive = JSON.parse(JSON.stringify(this.mapBase));
      this.tiles = result.tileData.rows;
      this.player = result.playerData;

      this.player.y = 7;
      this.player.x = 7;
      this.player.doc = {};
      this.player.doc.color = '#1f00ff';
      this.player.doc.displayAs = '@';

      this.mapLive[this.player.y][this.player.x] = this.player._id;

      this.tilesIndex = this.tiles.map(oneTile => oneTile.id);
      this.tiles.push(this.player);
      this.tilesIndex.push(this.player._id);
      console.log(this.tiles);
      console.log(this.tilesIndex);
      this.isLoading = false;

    });

  }







}
