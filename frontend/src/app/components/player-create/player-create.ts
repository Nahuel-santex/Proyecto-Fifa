import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { PlayerService } from '../../services/player';

@Component({
  selector: 'app-player-create',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './player-create.html',
  styleUrls: ['./player-create.css']
})
export class PlayerCreateComponent {
  player: any = {
    long_name: "Nahuel (Mi Versión)",
    club_name: "Club de Programadores",
    player_positions: "CAM",
    nationality_name: "Argentina",
    overall: 99,
    pace: 99,
    shooting: 99,
    passing: 99,
    dribbling: 99,
    defending: 99,
    physic: 99
  }; 

  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private playerService: PlayerService
  ) { }
  onSave(): void {
    this.playerService.createPlayer(this.player).subscribe({
      next: (response: any) => {
        this.successMessage = '¡Jugador creado exitosamente!';
        setTimeout(() => {
          this.router.navigate(['/players', response.player.id]);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Error al crear jugador', err);
        this.errorMessage = 'No se pudo crear el jugador. ¿Faltan campos?';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/players']); 
  }
}