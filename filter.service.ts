import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { State, process } from '@progress/kendo-data-query';
import * as _ from 'lodash';

@Injectable()

export class FilterService {
     getDataBasedOnOperator() {


     }


     createFilterObj(columnConfig, state) {
         const filters = state.filter.filters;
         if ( filters && filters.length > 0 ) {
             for ( let i = 0; i < filters.length; i++) {
                 if(filters[i].value && filters[i].value.length > 3) {
                    
                    let filterType = "";
                    filterType = _.find(columnConfig, ['field', filters[i].field]).filterType;
                    filters[i].dataType = filterType;
                    console.log(_.find(columnConfig, ['field', filters[i].field]), _.find(columnConfig, ['field', filters[i].field]).filterType, filterType, filters[i].dataType);
                 }
             }
         }
         console.log(filters);
     }

}

