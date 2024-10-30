import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(value:number): string {
    return (Number(value) / 1000000).toFixed(2) + " Mb";
  }

}
