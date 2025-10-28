import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { PlayerService } from '../../services/player';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-edit.html',
  styleUrls: ['./player-edit.css']
})
export class PlayerEditComponent implements OnInit {
  player: any = {}; 
  playerId: string | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,    
    private playerService: PlayerService 
  ) { }

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');

    if (this.playerId) {
      this.playerService.getPlayerById(this.playerId).subscribe({
        next: (response: any) => {
          this.player = response; 
        },
        error: (err: any) => {
          console.error('Error al cargar jugador', err);
          this.errorMessage = 'No se pudo cargar el jugador.';
        }
      });
    }
  }

  onSave(): void {
    if (this.playerId) {
      this.playerService.updatePlayer(this.playerId, this.player).subscribe({
        next: (response: any) => {
          this.successMessage = '¡Jugador actualizado exitosamente!';
          setTimeout(() => {
            this.router.navigate(['/players', this.playerId]);
          }, 2000);
        },
        error: (err: any) => {
          console.error('Error al guardar jugador', err);
          this.errorMessage = 'No se pudo guardar el jugador.';
        }
      });
    }
  }

  goBack(): void {
    if (this.playerId) {
      this.router.navigate(['/players', this.playerId]); 
    } else {
      this.router.navigate(['/players']); 
    }
  }
}