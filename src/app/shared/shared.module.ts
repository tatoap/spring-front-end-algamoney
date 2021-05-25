import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageComponent } from './message/message.component';
import { CampoColoridoDirective } from './campo-colorido/campo-colorido.directive';

@NgModule({
  declarations: [
    MessageComponent,
    CampoColoridoDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MessageComponent,
    CampoColoridoDirective
  ]
})
export class SharedModule { }
