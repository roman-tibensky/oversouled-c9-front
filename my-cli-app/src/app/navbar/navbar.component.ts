/**
 * Created by aRTie on 27/08/2017.
 */


import { Component } from '@angular/core';
import { AuthService } from '../services/authentication.service';

@Component({
    selector: 'navi-ish-thing',
    template: `
        <md-toolbar color ="primary">
            Where to go
            <button md-button md-raised-button color="primary" routerLink="/">Home</button>
            <button md-button md-raised-button color="primary" routerLink="/release">Updates</button>
            <span style="flex: 1 1 auto"></span>
            <button *ngIf="!auth.isAuthenticated" md-button routerLink="/login">Log in</button>
            <button *ngIf="!auth.isAuthenticated" md-button routerLink="/register">Register</button>
            <button *ngIf="auth.isAuthenticated" md-button>Welcome {{auth.name}}</button>
            <button *ngIf="auth.isAuthenticated" md-button (click)="auth.logout()">Log out</button>
            <button *ngIf="!auth.isAuthenticated" md-button routerLink="/register">Sign In, Bucko</button>
        </md-toolbar>
    `
})
export class NavbarComponent {
    constructor(
        private auth: AuthService
    ) {}

}
