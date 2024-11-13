import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'row',
  standalone: true
})
export class RowPipe implements PipeTransform {

  transform(value: any, id:any): string {
    let result = "";
    const row = value[Number(id)];
    if (row) {
      result = row.map((r:any)=> r.eventName).at(0);
    }
    return result;
  }

}
