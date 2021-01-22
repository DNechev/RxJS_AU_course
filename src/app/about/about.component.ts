import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent, noop, Observable, timer } from 'rxjs';
import { interval } from 'rxjs';
import { count } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const httpObservable$ = new Observable(observer => {
      fetch('/api/courses')
      .then(response => {
        return response.json();
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(error => {
        observer.error(error);
      });
    });

    const sub = httpObservable$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('completed')
    );

    // const interval$ = timer(3000, 1000);

    // const sub = interval$.subscribe((val) => {
    //   console.log('stream 1 => ' + val);

    //   console.log('stream 2 => ' + val);
    // })

    // setTimeout(()=> sub.unsubscribe(), 5000);

    // const clickObservable = fromEvent(document, 'click');

    // clickObservable.subscribe(
    //   event => console.log(event),
    //   error => console.log(error),
    //   () => console.log('completed!')
    // )
  }
}
