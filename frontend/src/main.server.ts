import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; 
import { config } from './app/app.config.server';


export default function(context: any) {
  return bootstrapApplication(AppComponent, config, context); 
}