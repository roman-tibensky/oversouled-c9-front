/**
 * Created by aRTie on 20/08/2017.
 */

import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'release-notes',
    template: `<h2 align="center"><i>What... happened...?</i></h2>
    <div *ngFor="let oneMessage of webSer.messages | async">
        <md-card class="oneStory">
          <md-card-title [routerLink]="['/release',oneMessage.updateBy]"  align="center" style="cursor: pointer"><i>{{oneMessage.updateBy}}</i></md-card-title>
          <md-card-content align="center"><i>{{oneMessage.text}}</i></md-card-content>
        </md-card>
    </div>

    `
})
export class ReleaseNotesComponent implements OnInit {


    constructor(
        private webSer: WebService,
        private route: ActivatedRoute
    ) {

    }

    ngOnInit() {
        //this.webSer.getUser().subscribe(res => console.log(res));
        this.webSer.getMessages(this.route.snapshot.params.name);
        // this.webSer.messages.subscribe(messages => {
        //     this.messages = messages;
        // });
    }


}