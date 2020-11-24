import { Injectable } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';
const { Network } = Plugins;



@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private toastController: ToastController, private plt: Platform) {
    console.log('Init NetworkService');
    this.plt.ready().then(() => {
      Network.getStatus().then((status) => {
        console.log(status);
        this.status.next(status.connected);
      });
    });
    this.initializeNetworkEvents();
  }

  public initializeNetworkEvents() {
    Network.addListener('networkStatusChange', (status) => {
      console.log('networkStatusChange event', status);
      this.status.next(status.connected);
    });
  }


  public onNetworkChange(): Observable<boolean> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): boolean {
    return this.status.getValue();
  }
  public isOnline(): boolean {
    return this.status.getValue();
  }
}
