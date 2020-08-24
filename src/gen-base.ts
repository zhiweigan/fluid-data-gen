import FluidModel from "./model";
import type * as fType from "./types";

export abstract class Generator {
  samples: fType.noteArray[] = [];
  model: FluidModel;
  sampleNum: number = 0;
  completed: number = 0;
  clientOptions: fType.clientOptions = {
    targetPort: 9999,
    targetHost: '127.0.0.1',
    header: 0xf2b49e2c,
    timeout: 30000000,
    isUnixDomainSocket: false,
  }

  constructor (
    readonly params: fType.paramArray,
    readonly batches: number,
    readonly options? : fType.clientOptions,
  ) {
    this.model = new FluidModel();
    if (options) this.clientOptions = options;
  }

  async abstract send(v: any, sample: fType.noteArray): Promise<void>;

  getInterval = (min: number, max: number, num: number) => (max - min) / (num - 1);

  async getSamples(): Promise<fType.noteArray[]> {
    let numOfSamples = this.batches;
    for (let param of Object.values(this.params)){
      numOfSamples *= param.numQueries;
    }
  
    console.log('Generating', numOfSamples, 'samples');
  
    await this.model.load();
    const outputMel = await this.model.sampleMel(numOfSamples);
    console.log('Samples Generated')
  
    const samples = [];
    for (let sample of outputMel) {
      const notes = this.model.melNotesToFluid(sample.notes, sample.quantizationInfo!.stepsPerQuarter!)
      samples.push(notes);
    }
    
    this.sampleNum = 0;
    return samples;
  }

  async recurHelper (curr: number, values: any): Promise<void> {

    if (curr === Object.entries(this.params).length){
      await this.send(values, this.samples[this.sampleNum]);
      this.sampleNum++;
    } else{
      for (let i = this.params[curr].min; i <= this.params[curr].max; 
        i += this.getInterval(this.params[curr].min, this.params[curr].max , this.params[curr].numQueries)){
  
        values[this.params[curr].param] = i;
        await this.recurHelper(curr + 1, values);
      }
    }
  }

  async generate() {
    this.samples = await this.getSamples();
    this.completed = 0;

    for (let iter = 0; iter < this.batches; iter++){
      console.log('Sending batch:', iter);
      await this.recurHelper(0, {});
    }
  
    console.log('done')
  }
}