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
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';


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

      this.course$ = createHttpObservable('/api/courses/' + this.courseId)
    }

    ngAfterViewInit() {

      const filteredLessons$ = fromEvent(this.input.nativeElement, 'keyup').pipe(
        map(event => event['target'].value),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      )

      const initLessons$ = this.loadLessons();

      this.lessons$ = concat(initLessons$, filteredLessons$);
    }

    loadLessons(search: string = ''): Observable<Lesson[]>{
      return createHttpObservable('/api/lessons?courseId=' + this.courseId + '&pageSize=100&filter=' + search).pipe(
        map(response => response['payload']
        )
      );
    }
}
