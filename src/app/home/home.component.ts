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
      tap(() => console.log('request sent')),
      map(response => Object.values(response['payload'])),
      shareReplay<Course[]>(),
      catchError(error => of([{
        id: 0,
        description: "RxJs In Practice Course",
        iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
        courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
        category: 'BEGINNER',
        lessonsCount: 10
      }
      ]))
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
