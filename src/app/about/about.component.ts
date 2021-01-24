import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { concat, fromEvent, merge, noop, Observable, of, timer } from 'rxjs';
import { interval } from 'rxjs';
import { count, map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //#region concat strategy(waiting for each observable to complete)

    // This will never complete and therefore source 2 and 3 values would never be emited
    // const source1$ = interval(1000);

    // const source1$ = of(1, 2 , 3);

    // const source2$ = of(4, 5, 6);

    // const source3$ = of(7, 8, 9);

    // const result = concat(source1$, source2$, source3$);

    // result.subscribe(numbers => console.log(numbers));

    //#endregion

    //#region merge strategy (observables are being subscribed to parallely)

    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(
      map(value => value * 10)
    );

    const result$ = merge(interval1$, interval2$);

    // result$.subscribe(values => console.log(values));
    //#endregion
  }
}
