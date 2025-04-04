import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h1>Thank You!</h1>
        <p>{{ message }}</p>
        <button class="back-button" (click)="goHome()">Back to Home</button>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000000;
      color: white;
    }
    
    .success-card {
      background: rgba(0, 255, 255, 0.05);
      padding: 3rem;
      border-radius: 16px;
      text-align: center;
      border: 1px solid rgba(0, 255, 255, 0.1);
      max-width: 400px;
      width: 90%;
    }
    
    .success-icon {
      font-size: 4rem;
      color: #00ffff;
      margin-bottom: 1.5rem;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #00ffff;
    }
    
    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      color: #b0b0b0;
    }
    
    .back-button {
      background: linear-gradient(135deg, #00ffff, #00cccc);
      color: #000000;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .back-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
    }
  `]
})
export class SuccessComponent implements OnInit {
  message: string = 'Your request has been sent successfully!';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.message = navigation.extras.state['message'];
    }
  }

  ngOnInit(): void {}

  goHome() {
    this.router.navigate(['/']);
  }
}
