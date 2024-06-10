import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedperfilComponent } from './feedperfil.component';

describe('FeedperfilComponent', () => {
  let component: FeedperfilComponent;
  let fixture: ComponentFixture<FeedperfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedperfilComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FeedperfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
