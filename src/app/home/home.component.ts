import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {
    const httpObservable$ = createHttpObservable('/api/courses');

    const coursesObservable$: Observable<Course[]> = httpObservable$.pipe(
            map(response => Object.values(response['payload']))
    );

    this.beginnerCourses$ = coursesObservable$
    .pipe(
      map(courses => courses.filter(course => course.category == 'BEGINNER'))
    );

    this.advancedCourses$ = coursesObservable$
    .pipe(
      map(courses => courses.filter(course => course.category == 'ADVANCED'))
    );
  }
}
