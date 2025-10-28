import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './player-list.html',
  styleUrls: ['./player-list.css']
})
export class PlayerListComponent implements OnInit {

  players: any[] = [];
  paginationData: any = {};
  errorMessage = '';
  filters: any = {
    name: '',
    club: '',
    position: ''
  };

  constructor(
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getPlayers(this.filters).subscribe({
      next: (response: any) => {
        this.players = response.players;
        this.paginationData = response;
      },
      error: (err: any) => {
        console.error('Error al cargar jugadores', err);
        this.errorMessage = 'Error al cargar jugadores.';
        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  onFilterChange(): void {
    this.loadPlayers();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}