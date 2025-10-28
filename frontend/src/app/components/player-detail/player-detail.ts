// src/app/components/player-detail/player-detail.ts

// --- IMPORTAMOS ChangeDetectorRef ---
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { PlayerService } from '../../services/player';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [ CommonModule, RouterLink, BaseChartDirective ],
  templateUrl: './player-detail.html',
  styleUrls: ['./player-detail.css']
})
export class PlayerDetailComponent implements OnInit {

  player: any = null;
  errorMessage = '';
  public radarChartOptions: ChartConfiguration['options'] = { /* ... (tu config de radar) ... */ };
  public radarChartLabels: string[] = [ 'Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physic' ];
  public radarChartType: ChartType = 'radar';
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [ { data: [], label: 'Skills' } ]
  };

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef // --- INYECTAMOS EL DETECTOR DE CAMBIOS ---
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.playerService.getPlayerById(id).subscribe({
        next: (response: any) => {
          this.player = response;
          this.updateChartData(response);

          // --- ¡EL ARREGLO! ---
          // Le decimos a Angular: "¡Oye! Los datos cambiaron, refresca la pantalla AHORA."
          this.cdr.detectChanges(); 
        },
        error: (err: any) => {
          console.error('Error al cargar jugador', err);
          this.errorMessage = 'No se pudo cargar el jugador.';
        }
      });
    }
  }

  updateChartData(player: any): void {
    const skills = [
      player.pace,
      player.shooting,
      player.passing,
      player.dribbling,
      player.defending,
      player.physic
    ];

    // Usamos el "nuevo objeto" para forzar el refresco del gráfico
    this.radarChartData = {
      labels: this.radarChartLabels,
      datasets: [
        { 
          data: skills, 
          label: `${player.long_name} (Overall: ${player.overall})` 
        }
      ]
    };
  }
}