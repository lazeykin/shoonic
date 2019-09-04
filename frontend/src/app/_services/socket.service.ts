import { NotificationModel } from './../_models/notification';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Observer} from 'rxjs';

import * as socketIo from 'socket.io-client';
import {Message} from "../_models";



@Injectable()
export class SocketService {
    private socket;

    userLogged(token){
        this.disconnect()
        this.connect(token)
    }
    
    userUnLogged() {
        this.disconnect()
    }
    
    public onNewMessage: BehaviorSubject<Message> = new BehaviorSubject<Message>(null);
    public onDialogMarkRead: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public onNewNotification: BehaviorSubject<NotificationModel> = new BehaviorSubject<NotificationModel>(null);
    
    private connect(token: string): void {
        // this.socket = socketIo('http://localhost:8888', {
        this.socket = socketIo('https://shoonic.dev.tseh20.com', {
            reconnection: false,
            query: {
                'token': 'JWT ' + token
            },
            transports: ['websocket', 'polling'],
            'sync disconnect on unload': true,
        });
        
        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected')
        })

        this.socket.on('connect', () => {
            console.log('Socket Connected')
        })
        this.socket.on('message:new', (msg) => {
            console.log('message:new')
            console.log(msg)
            this.onNewMessage.next(msg)
        })
        
        this.socket.on('dialog:mark_read', (msg) => {
            console.log('dialog:mark_read')
            console.log(msg)
            this.onDialogMarkRead.next(msg.dialog_id)
        })

        this.socket.on('notification:new', (msg) => {
            console.log('notif:new');
            console.log(msg);
            this.onNewNotification.next(msg);
        })
        
        console.log('Do connect')
        this.socket.connect()
    }
    
    private disconnect(): void {
    
    }
    
}
