import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedlistaComponent } from './feedlista.component';

describe('FeedlistaComponent', () => {
  let component: FeedlistaComponent;
  let fixture: ComponentFixture<FeedlistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedlistaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FeedlistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
