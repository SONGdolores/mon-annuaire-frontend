import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || isNaN(value) || value < 0) {
      return '';
    }

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    let result = '';
    if (hours > 0) {
      result += hours + 'h';
    }
    if (minutes > 0) {
      result += minutes + 'min';
    }
    if (result === '') {
      result = '0min';
    }
    return result;
  }

}
