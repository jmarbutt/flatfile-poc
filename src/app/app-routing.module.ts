import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactImportComponent } from './contact-import/contact-import.component';


const routes: Routes = [
  {
    path:'',
    component: ContactImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
