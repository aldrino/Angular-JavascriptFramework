import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
})
export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishcopy = null;
  errMess: string;
  dishIds: number[];
  prev: number;
  next: number;
  visibility = 'shown';

  @ViewChild('fform') commentFormDirective;
  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'author': '',
    'comment': ''
  }

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.'
    }
  }

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id'])} ))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; }, 
      errmess => this.errMess = <any>errmess.message);
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  
  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ['', [Validators.required]]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    this.commentFormDirective.resetForm({
      rating: 5
    });
  }

}
