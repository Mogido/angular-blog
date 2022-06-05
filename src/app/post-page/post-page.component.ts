import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../shared/interfaces";
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../shared/services/posts.service";
import {Observable, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit, OnDestroy {

  post$: Observable<Post>;

  pSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService
  ) { }

  ngOnInit(): void {
    this.post$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.GetPostById(params['id']);
        })
      )
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }

}
