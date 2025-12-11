import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartRentalComponent } from './start-rental.component';

describe('StartRentalComponent', () => {
  let component: StartRentalComponent;
  let fixture: ComponentFixture<StartRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartRentalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
