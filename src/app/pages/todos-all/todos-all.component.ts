import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../_services';
// RxJS
import { takeUntil, tap, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-todos-all',
  templateUrl: './todos-all.component.html',
  styleUrls: ['./todos-all.component.scss']
})
export class TodosAllComponent implements OnInit {
  private unsubscribe: Subject<any>;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor( private api: RequestsService) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.getTableInfo();
  }

  /*
  * On destroy
  */
	ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTableInfo() {
    return this.api.getAllTodos()
    .pipe(
      tap(todos => todos),
      takeUntil(this.unsubscribe)
    )
    .subscribe(todos => {
      console.log('Todos', todos);
    })
  }

}
