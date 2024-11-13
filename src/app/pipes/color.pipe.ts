import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'color',
  standalone: true
})
export class ColorPipe implements PipeTransform {

  transform(value: any, id:any): unknown {
    let result = "transparent";
    const row = value[Number(id)];
    if (row) {
      result = row.map((r:any)=> r.color).at(0);
    }
    console.log(value);
    return result;
  }

}
