import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as _ from 'lodash';
 

@Injectable()

export class ConversionService {

public treeStructure = [];

public fromNodes: string[] = [];

public nodeIndex = -1;
 public finalCf =1;

public arr: ConversionModel[]  = [{"from":"lb","to":"mt","cf":0.000453},{"from":"mt","to":"lb","cf":2207.5055187637968},{"from":"mtone","to":"kg","cf":1000},{"from":"kg","to":"mtone","cf":0.001},{"from":"test465874","to":"test465874","cf":123},{"from":"test465874","to":"test465874","cf":0.008130081300813009},{"from":"asdsad","to":"uom_code_001","cf":22},{"from":"uom_code_001","to":"asdsad","cf":0.045454545454545456},{"from":"sdfsdf","to":"uom_code_001","cf":55},{"from":"uom_code_001","to":"sdfsdf","cf":0.01818181818181818},{"from":"adasd","to":"12345","cf":34},{"from":"12345","to":"adasd","cf":0.029411764705882353},{"from":"sfsds","to":"3151","cf":87},{"from":"3151","to":"sfsds","cf":0.011494252873563218},{"from":"kgs","to":"mt","cf":100},{"from":"mt","to":"kgs","cf":0.01},{"from":"vxcvxcv","to":"3156","cf":1},{"from":"3156","to":"vxcvxcv","cf":1},{"from":"kg","to":"mt","cf":0.001},{"from":"mt","to":"kg","cf":1000},{"from":"testab_1, $11-+@123}","to":"ton","cf":0.00009},{"from":"ton","to":"testab_1, $11-+@123}","cf":11111.111111111111},{"from":"testingperformance1","to":"t11","cf":1.1},{"from":"t11","to":"testingperformance1","cf":0.9090909090909091},{"from":"uom_code_001","to":"ton","cf":0.0018},{"from":"ton","to":"uom_code_001","cf":555.5555555555555},{"from":"\"","to":"ton","cf":0.01},{"from":"ton","to":"\"","cf":100},{"from":"12345","to":"ton","cf":1},{"from":"ton","to":"12345","cf":1}];



 // uom calculation

 rearrangeJson(data) {

      let obj: ConversionModel = new ConversionModel();

      for ( let i = 0; i < data.length ; i++) {

        if (data[i].baseUomCode !== null && data[i].uomConversionFactor !== null && data[i].uomCode !== null) {

          obj = new ConversionModel();

          obj['from'] = data[i]['uomCode'].toString().toLowerCase();

          obj['to'] = data[i]['baseUomCode'].toString().toLowerCase();

          obj['cf'] = data[i]['uomConversionFactor'];

          this.arr.push(obj);

          obj = new ConversionModel();

          obj['from'] = data[i]['baseUomCode'].toString().toLowerCase();

          obj['to'] = data[i]['uomCode'].toString().toLowerCase();

          obj['cf'] = (1 / data[i]['uomConversionFactor']);

          this.arr.push(obj);

        }

      }

      console.log(this.arr);
    
      return this.arr;

    }

 

     generateTree(frm, to) {
        console.log('tree', _.cloneDeep(this.treeStructure));
       if (frm && to) {

        frm = frm.toString().toLowerCase();

        to = to.toString().toLowerCase();

        const bestCase = this.arr.filter(x => x.from === frm && x.to === to);
        if(bestCase.length>0) {
            this.treeStructure.push({id:  this.nodeIndex, parentNode: -1, nodeName: bestCase[0].from +'-'+ bestCase[0].to, cf: bestCase[0].cf, isFinal: true });
        } else {
        

        this.nodeIndex = this.nodeIndex + 1;

       if ( this.nodeIndex === 0) {

         this.treeStructure.push({id:  this.nodeIndex, parentNode: -1, nodeName: frm, cf: 1 })

       }

       if (this.fromNodes.indexOf(frm) === -1) {

         this.fromNodes.push(frm);

       }

       console.log('parameter  ' , frm , to);

      const requiredSetOfData = this.arr.filter(x => x.from === frm );

      console.log('result ' , requiredSetOfData);

      if (requiredSetOfData.length > 0) {

        for ( let i = 0 ; i < requiredSetOfData.length ; i++) {

          console.log(requiredSetOfData[i].from , requiredSetOfData[i].to);

          if (requiredSetOfData[i].to !== to) {

              console.log('check after data  ' , requiredSetOfData[i].to , to);

              if (this.fromNodes.indexOf(requiredSetOfData[i].to) === -1) {

                if ( this.nodeIndex !== 0) {

                  // tslint:disable-next-line:max-line-length

                  this.treeStructure.push({id:  this.nodeIndex, parentNode: ( this.nodeIndex - 1), nodeName: requiredSetOfData[i].to, cf: requiredSetOfData[i].cf });

                }

                this.generateTree( requiredSetOfData[i].to , to);

              }

          } else {

            if ( this.nodeIndex !== 0) {

              // tslint:disable-next-line:max-line-length

              this.treeStructure.push({id:  this.nodeIndex, parentNode: ( this.nodeIndex - 1), nodeName: frm, cf: requiredSetOfData[i].cf });

            }

 

            // tslint:disable-next-line:max-line-length

            this.treeStructure.push({id:  this.nodeIndex + 1, parentNode:  this.nodeIndex, nodeName: to, cf: requiredSetOfData[i].cf, isFinal: true });

            console.log('reached the destination');

          }

        }

       // this.getConverionRate(frm , to);

      }
    
      // this.treeStructure.splice(this.treeStructure.length-1, 1);

      console.log('fdsfdsgdsfgs' , requiredSetOfData);
    }

       }

    }

 

    getParentNode(parentNodeId, finalCf): number {

    const parentObj = this.treeStructure.filter(x => x.id === parentNodeId );

    console.log('parentOBJ' ,parentNodeId,  parentObj, finalCf);

    if (parentObj.length > 0) {

       this.finalCf =  this.finalCf * parentObj[0].cf;

       if (parentNodeId !== -1) {

        this.getParentNode(parentObj[0].parentNode, this.finalCf);

      }

    }

    return this.finalCf;

  }

  getConvertionFactor(): number {

    const leafNode = this.treeStructure.filter(x => x.isFinal === true );

    if (leafNode.length > 0) {

         console.log(leafNode[0].parentNode);

        this.finalCf = 1;

        this.finalCf = this.getParentNode(leafNode[0].parentNode, this.finalCf);

        console.log('finalCf    ' , this.finalCf);

        this.treeStructure = [];

        this.fromNodes = [];

        this.nodeIndex = -1;

        return this.finalCf;

    } else {

        return 1;

    }

    // while (this.getParentNode(leafNode[0].parentNode) !== -1) {

  }

 

}






export class ConversionModel {

    public from: string;

    public to: string;

    public cf: number;

}