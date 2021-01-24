import { Observable } from "rxjs";
import { Course } from "../model/course";

export function createHttpObservable(url: string) : Observable<any>{
  return new Observable(observer => {

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {signal: signal})
    .then(response => {
      console.log(response.url);
      return response.json();
    })
    .then(body => {
      observer.next(body);
      observer.complete();
    })
    .catch(error => {
      observer.error(error);
    });

    return () => controller.abort();
  });
}
