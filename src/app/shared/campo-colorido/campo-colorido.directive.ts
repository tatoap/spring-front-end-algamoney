import { Directive, Input, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCampoColorido]'
})
export class CampoColoridoDirective {

  @Input('appCampoColorido') cor = 'yellow';

  @HostBinding('style.backgroundColor') corDeFundo: string = 'transparent';

  @HostListener('focus') aoGanharFoco() {
    this.corDeFundo = this.cor;
  }

  @HostListener('blur') aoPerderFoco() {
    this.corDeFundo = 'transparent';
  }

}
