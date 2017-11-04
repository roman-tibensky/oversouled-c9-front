/**
 * Created by aRTie on 28/10/2017.
 */


import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';
import { MdDialog } from '@angular/material';
import { GameOverDialogComponent } from '../dialogs/game-over.component';
import * as _ from 'lodash';
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
    private dialog: MdDialog,
  ) {
    this.isLoading = true;
    this.tilesIndex = [];
  }



  ngOnInit() {
    this.webSer.loadFirstLevel().subscribe(result => {
      this.mapBase = result.mapData.tiles;

      this.tiles = result.tileData.rows;
      this.player = result.playerData;

      this.resetPlayer();
      this.updateMap();

      this.tilesIndex = this.tiles.map(oneTile => oneTile.id);
      this.tiles.push(this.player);
      this.tilesIndex.push(this.player._id);
      console.log(this.tiles);
      console.log(this.tilesIndex);
      this.isLoading = false;

    });



  }

  printPosition(y, x) {
    console.log(y + '.' + x);
  }


  initMove(yChange, xChange) {


    if (this.tiles[this.tilesIndex.indexOf(this.mapBase[this.player.y + yChange][this.player.x + xChange])].doc.canEnter){
      this.player.y += yChange;
      this.player.x += xChange;

      this.player.curHp += this.player.hpAdjust;
      this.movePlayer();
      if (this.player.curHp <= 0) {
        this.gameOverDialog();

      }
    }
  }

  movePlayer() {
    this.mapLive = _.cloneDeep(this.mapBase);
    this.mapLive[this.player.y][this.player.x] = this.player._id;
  }

  gameOverDialog() {
    const dialogRef = this.dialog.open(GameOverDialogComponent, {
      width: '300px',
      disableClose: true

    });



    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.resetPlayer();
      this.updateMap();
    });
  }

  resetPlayer() {
    this.player.y = 7;
    this.player.x = 7;
    this.player.doc = {};
    this.player.doc.color = '#1f00ff';
    this.player.doc.displayAs = '@';
    this.player.curHp = _.cloneDeep(this.player.hp);
  }

  updateMap() {
    this.mapLive = _.cloneDeep(this.mapBase);
    this.mapLive[this.player.y][this.player.x] = this.player._id;
  }

}
