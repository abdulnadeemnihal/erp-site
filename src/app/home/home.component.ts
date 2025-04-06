import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterOutlet
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  activeTestimonialIndex: number = 0;
  testimonialInterval: any;
  expandedModule: string | null = null;
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      company: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
    
    this.startTestimonialCarousel();
    this.setupNavigation();
    this.setupScrollListener();
  }

  ngAfterViewInit(): void {
    this.addScrollAnimations();
    this.addModuleEventListeners();
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  private startTestimonialCarousel(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  nextTestimonial(): void {
    this.activeTestimonialIndex = (this.activeTestimonialIndex + 1) % 3;
    this.updateTestimonialDisplay();
  }

  updateTestimonialDisplay(): void {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.carousel-dot');
    
    testimonials.forEach((item, i) => {
      item.classList.remove('active');
      dots[i].classList.remove('active');
    });
    
    testimonials[this.activeTestimonialIndex].classList.add('active');
    dots[this.activeTestimonialIndex].classList.add('active');
  }

  private setupNavigation(): void {
    const navLinks = document.querySelectorAll('nav.nav-menu a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        
        if (href) {
          navLinks.forEach(l => l.classList.remove('active'));
          (e.currentTarget as HTMLElement).classList.add('active');
          
          const targetSection = document.querySelector(href);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header') as HTMLElement | null;
      const headerHeight = header ? header.offsetHeight : 0;
      let current = '';
      
      document.querySelectorAll('section[id]').forEach((section: Element) => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop - headerHeight - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id') || '';
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  private setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header') as HTMLElement | null;
      
      if (window.pageYOffset > 0) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });
  }

  addScrollAnimations(): void {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.classList.add('fade-in');
    }
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.section-title').forEach(title => {
      observer.observe(title);
    });
    
    document.querySelectorAll('.module-item').forEach(module => {
      observer.observe(module);
    });
  }

  addModuleEventListeners(): void {
    const moduleItems = document.querySelectorAll('.module-item');
    
    moduleItems.forEach(module => {
      module.addEventListener('mouseenter', (e) => {
        const target = e.currentTarget as HTMLElement;
        const icon = target.querySelector('.feature-icon') as HTMLElement;
        
        if (icon) {
          icon.style.transform = 'scale(1.2)';
          icon.style.transition = 'transform 0.3s ease';
        }
      });
      
      module.addEventListener('mouseleave', (e) => {
        const target = e.currentTarget as HTMLElement;
        const icon = target.querySelector('.feature-icon') as HTMLElement;
        
        if (icon) {
          icon.style.transform = 'scale(1)';
        }
      });
    });
  }

  expandModule(moduleId: string): void {
    if (this.expandedModule === moduleId) {
      this.expandedModule = null;
    } else {
      this.expandedModule = moduleId;
      
      setTimeout(() => {
        const moduleDetails = document.getElementById(`${moduleId}-details`);
        if (moduleDetails) {
          moduleDetails.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  scrollToContactForm(): void {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        const formData = this.contactForm.value;
        const message = `New Lead from ${formData.name}:\n\nCompany: ${formData.company}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nRequirements: ${formData.message}`;
        
        const cleanMessage = encodeURIComponent(message.replace(/\n/g, '%0A'));
        const smsLink = document.createElement('a');
        smsLink.href = `sms:9884341528?body=${cleanMessage}`;
        smsLink.click();

        setTimeout(() => {
          this.router.navigate(['/success'], {
            state: {
              message: 'Your request has been sent successfully! We will contact you soon.'
            }
          });
          this.contactForm.reset();
          this.isSubmitting = false;
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your request. Please try again.');
        this.isSubmitting = false;
      }
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}