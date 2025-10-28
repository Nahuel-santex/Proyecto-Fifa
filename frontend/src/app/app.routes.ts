import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { PlayerListComponent } from './components/player-list/player-list';
import { PlayerDetailComponent } from './components/player-detail/player-detail';
import { PlayerEditComponent } from './components/player-edit/player-edit';
import { authGuard } from './guards/auth-guard'; 
import { PlayerCreateComponent } from './components/player-create/player-create';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { 
    path: 'players', 
    component: PlayerListComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'players/new',
    component: PlayerCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'players/:id', 
    component: PlayerDetailComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'players/:id/edit',
    component: PlayerEditComponent, 
    canActivate: [authGuard] 
  }
];