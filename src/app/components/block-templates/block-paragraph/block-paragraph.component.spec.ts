import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockParagraphComponent } from './block-paragraph.component';

describe('BlockParagraphComponent', () => {
  let component: BlockParagraphComponent;
  let fixture: ComponentFixture<BlockParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockParagraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
