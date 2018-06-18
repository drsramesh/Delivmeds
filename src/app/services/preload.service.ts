import { Injectable } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner'
@Injectable()
export class PreloadService {

  constructor(private loader: Ng4LoadingSpinnerService) { }

  open(){
    this.loader.show();
  }


  close(){
    this.loader.hide();
  }

}
