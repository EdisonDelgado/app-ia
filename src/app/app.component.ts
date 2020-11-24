import { Component, OnInit } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, RouterEvent } from '@angular/router';
import { Location } from '@angular/common';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public activePath = '';
  public appPages = [
    {
      title: 'Inicio',
      url: 'home',
      icon: 'home'
    },
    {
      title: 'Historial',
      url: 'history',
      icon: 'file-tray-full'
    }
  ];
  public user = { email: 'info@tide.cl', name: 'TIDE S.A.' };

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private location: Location,
    private alertController: AlertController,
    private router: Router,
  ) {
    this.initializeApp();

    // actualiza la ruta para visualizar correctamente en el menú lateral la ruta actual
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url) {
        this.activePath = event.url;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      SplashScreen.hide();
    });


    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      if (this.location.isCurrentPathEqualTo('/home')) {
        this.showExitConfirm();
        processNextHandler();
      } else if (this.location.isCurrentPathEqualTo('/login')) {
        navigator['app'].exitApp();
      } else {
        // Navigate to back page
        this.location.back();
      }
    });

    this.platform.backButton.subscribeWithPriority(5, () => {
      this.alertController.getTop().then(r => {
        if (r) {
          // tslint:disable-next-line: no-string-literal
          navigator['app'].exitApp();
        }
      }).catch(e => {
        console.log(e);
      });
    });
  }

  ngOnInit() {
    /*const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }*/
  }

  async logout() {
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea Cerrar la Sesión?',
      message: 'La siguiente acción cerrará la sesión actual.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Sí',
          handler: () => {
            /*this.auth.logout().subscribe((response: any) => {
              if (response.res) {
                this.auth.setCurrentUser(null);
              }
            });*/
            // this.auth.setCurrentUser(null);
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  showExitConfirm() {
    this.alertController.create({
      header: '¿Desea salir?',
      message: 'La siguiente operación cerrará la aplicación.',
      backdropDismiss: false,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Salir',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
}
