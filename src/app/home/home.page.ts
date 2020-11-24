import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { ActionSheetController } from '@ionic/angular';
import { NetworkService } from '../services/network.service';
import { ApiService } from '../services/api.service';
import { Plugins, CameraResultType, CameraOptions, CameraSource } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private cameraOptions: CameraOptions = {
    quality: 50,
    resultType: CameraResultType.Base64,
    width: 1024,
    height: 1024,
    preserveAspectRatio: true,
    correctOrientation: true
  };
  private PHOTOLIBRARY = 1;
  private CAMERA = 0;
  private thumbnail: string;
  private photo = null;

  constructor(
    private network: NetworkService,
    private data: DataService,
    private api: ApiService,
    public alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private toast: ToastController,
    private loading: LoadingController,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }
  async takeSnap() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Adjuntar Fotografías',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Desde la cámara',
        icon: 'camera',
        handler: () => {
          this.fromCamera();
        }
      }, {
        text: 'Desde la galería',
        icon: 'images',
        handler: () => {
          this.fromGallery();
        }
      }]
    });
    await actionSheet.present();
  }

  setSourceType(sourceType: any) {
    if (this.PHOTOLIBRARY === sourceType) {
      this.cameraOptions.source = CameraSource.Photos;
    } else {
      this.cameraOptions.source = CameraSource.Camera;
    }
  }

  fromCamera() {
    this.setSourceType(this.CAMERA);
    this.capture();
  }

  fromGallery() {
    this.setSourceType(this.PHOTOLIBRARY);
    this.capture();

  }

  capture() {
    Camera.getPhoto(this.cameraOptions).then((imageData) => {

      this.photo = 'data:image/jpeg;base64,' + imageData.base64String;
      this.generateFromImage(this.photo, 200, 200, 1, (thumb: any) => {
        this.thumbnail = thumb;
      });
    }, (err) => {
      console.log(err);
    });
  }

  generateFromImage(img: any, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback: any) {
    let canvas: any = document.createElement('canvas');
    let image = new Image();

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl);
    };
    image.src = img;
  }

  detect() {
    if (!this.network.isOnline) {
      this.presentToast('En este momento no se puede detectar la enfermedad. Por favor conecte su dispositivo a internet.');
      return;
    }
    this.api.detect(this.photo).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
        this.presentToast('Ocurrió un error al detectar la enfermedad.');
      });
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({ message, duration: 3000, position: 'bottom' });
    toast.present();
  }

  async presentLoadingText(message: string) {
    const loading = await this.loading.create({
      spinner: 'circles',
      message
    });
    loading.present();
  }
}
