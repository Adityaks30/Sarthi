import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Support } from './support.component';

describe('Support', () => {
  let component: Support;
  let fixture: ComponentFixture<Support>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Support],
    }).compileComponents();

    fixture = TestBed.createComponent(Support);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
