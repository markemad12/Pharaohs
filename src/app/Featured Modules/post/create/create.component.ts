import { Component, Inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormGroup, FormControl, Validators} from '@angular/forms';
import { NotesService } from 'src/app/Featured Modules/post/services/notes.service';

     

@Component({

  selector: 'app-create',

  templateUrl: './create.component.html',

  styleUrls: ['./create.component.scss']

})

export class CreateComponent implements OnInit {

  form!: FormGroup;

  constructor(

    public postService: NotesService,

    private router: Router

  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({

      title: new FormControl('', [Validators.required]),

      content: new FormControl('',[Validators.required]),

      category: new FormControl('', [Validators.required]),

      priority: new FormControl('', [Validators.required]),

      tags: new FormControl('', [Validators.required])

    });

  }

  get f(){

    return this.form.controls;

  }

  submit() {
    if (this.form.valid) {
      this.postService.create(this.form.value).subscribe({
        next: (res) => {
          console.log('Post created!');
          this.router.navigateByUrl('post');
        },
        error: (err) => {
          console.error('Error creating post:', err);
          // Display error message to user
        }
      });
    }
  }

  

}