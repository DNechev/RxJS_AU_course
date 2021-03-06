import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, throttle, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    courseId: number;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

      this.courseId = this.route.snapshot.params['id'];

      console.log('/api/courses/${courseId}');

      this.course$ = createHttpObservable('/api/courses/' + this.courseId).pipe(
        debug(RxJsLoggingLevel.INFO, 'Course value')
      )

      this.lessons$ = this.loadLessons();

      forkJoin(this.course$, this.lessons$).pipe(
        tap(([course, lessons]) => {
          console.log('course: ', course);

          console.log('lessons: ', lessons);
        })
      )
      .subscribe(console.log);
    }

    ngAfterViewInit() {
      this.lessons$ = fromEvent(this.input.nativeElement, 'keyup').pipe(
        map(event => event['target'].value),
        startWith(''),
        debug(RxJsLoggingLevel.INFO, 'search'),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search)),
        debug(RxJsLoggingLevel.INFO, 'lessons value')
      )

      // Throttling
      // fromEvent(this.input.nativeElement, 'keyup').pipe(
      //   map(event => event['target'].value),
      //   startWith(''),
      //   throttleTime(500)
      // ).subscribe(console.log)
    }

    loadLessons(search: string = ''): Observable<Lesson[]>{
      return createHttpObservable('/api/lessons?courseId=' + this.courseId + '&pageSize=100&filter=' + search).pipe(
        map(response => response['payload']
        )
      );
    }
}
