/**
 * Created by aRTie on 28/10/2017.
 */


import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';
import { MoveResolutionService } from '../services/move-resolution.service';
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
	npcs;
	showCreature;
	showPlayer;
	showTile;
	currShowing;

	constructor(
		private webSer: WebService,
		private dialog: MdDialog,
		private moveSer: MoveResolutionService,
	) {
		this.isLoading = true;
		this.tilesIndex = [];
		this.showCreature = false;
		this.showPlayer = false;
		this.showTile = false;
		this.currShowing = {};

	}



	ngOnInit() {
		this.webSer.loadFirstLevel().subscribe(result => {
			this.mapBase = result.mapData.tiles;

			this.tiles = result.tileData.rows;
			this.player = result.playerData;
			this.npcs = result.npcData;



			this.tilesIndex = this.tiles.map(oneTile => oneTile.id);
			this.tiles.push(this.player);
			this.tilesIndex.push(this.player._id);

			for (const oneNpc in this.npcs) {
				this.npcs[oneNpc].curHp = _.cloneDeep(this.npcs[oneNpc].doc.baseHp);
				this.npcs[oneNpc].curLvl = _.cloneDeep(this.npcs[oneNpc].doc.baseLevel);
				this.npcs[oneNpc].origX = _.cloneDeep(this.npcs[oneNpc].x);
				this.npcs[oneNpc].origY = _.cloneDeep(this.npcs[oneNpc].y);
				this.npcs[oneNpc].curMove = 0;
				this.tiles.push(this.npcs[oneNpc]);
				this.tilesIndex.push(this.npcs[oneNpc]._id);
			}

			this.resetPlayer();

			this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);

			this.isLoading = false;

		});



	}

	checkAction (y, x) {
		console.log(y + '.' + x);
		this.currShowing = _.cloneDeep(this.tiles[this.tilesIndex.indexOf(this.mapLive[y][x])]);
		switch (this.currShowing.doc.clickType) {
			case 'creature':
				this.showCreature = true;
				this.showPlayer = false;
				this.showTile = false;
				break;
			case 'player':
				this.showCreature = false;
				this.showPlayer = true;
				this.showTile = false;
				break;
			case 'tile':
				this.showCreature = false;
				this.showPlayer = false;
				this.showTile = true;
				break;
			default:
				this.showCreature = false;
				this.showPlayer = false;
				this.showTile = false;
				break;
		}
	}


	initMove (yChange, xChange) {
		this.player = this.moveSer.initMove(this.tiles, this.tilesIndex, this.mapBase, this.mapLive, this.player, yChange, xChange,'canEnter');

		if (this.player.curHp <= 0) {
			this.gameOverDialog();
		}

		if (this.player.moved) {
			this.moveSer.moveObjects(this.tiles, this.tilesIndex, this.mapBase, this.mapLive, this.player, this.npcs);
			this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
		}

	}


	gameOverDialog() {
		const dialogRef = this.dialog.open(GameOverDialogComponent, {
			width: '300px',
			disableClose: true
		});



		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog closed: ${result}`);
			this.resetPlayer();
			this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
		});
	}

	resetPlayer() {
		this.player.y = 7;
		this.player.x = 7;
		this.player.doc = {};
		this.player.doc.color = '#1f00ff';
		this.player.doc.displayAs = '@';
		this.player.doc.clickType = 'player';
		this.player.curHp = _.cloneDeep(this.player.hp);
		for (const oneNpc in this.npcs) {
			this.npcs[oneNpc].curHp = _.cloneDeep(this.npcs[oneNpc].doc.baseHp);
			this.npcs[oneNpc].x = _.cloneDeep(this.npcs[oneNpc].origX);
			this.npcs[oneNpc].y = _.cloneDeep(this.npcs[oneNpc].origY);
		}
	}



}
