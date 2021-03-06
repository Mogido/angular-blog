import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../../shared/services/posts.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  pSub: Subscription;
  dSub: Subscription;
  searchStr: string = '';

  constructor(
    private postsService: PostsService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.pSub = this.postsService.getAllPosts().subscribe(posts => {
      this.posts = posts
    })
  }

  remove(id: string | undefined) {
    this.dSub = this.postsService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alert.warning('Post is deleted');
    });
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }
}
