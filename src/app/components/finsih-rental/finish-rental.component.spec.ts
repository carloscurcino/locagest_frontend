import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishRentalComponent } from './finish-rental.component';

describe('FinishRentalComponent', () => {
  let component: FinishRentalComponent;
  let fixture: ComponentFixture<FinishRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


