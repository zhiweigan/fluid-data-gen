import { Generator } from './gen-base';
import type * as fType from './types';
import path from 'path';
const fluid = require('fluid-music')

const oscTune = (v: number) => (v + 24) / 48;
const getRandom  = (min = 0, max = 1) => Math.random() * (max - min) + min;

class DelayGenerator extends Generator {

  async send(v: any, sample: fType.noteArray): Promise<void> {
    
    let client = new fluid.Client(this.clientOptions);
    let renderClient = new fluid.Client(this.clientOptions);

    let attackVal = getRandom();
    let decayVal = getRandom();
    let sustainVal = getRandom();
    let releaseVal = getRandom(0, 0.6);
    let wavewarpVal = getRandom();
    let cutoffVal = getRandom(0.2, 1);

    const msg = [
      fluid.content.clear(),
      fluid.audiotrack.select('melody-podo'),
      fluid.midiclip.create('melody-podo', 0, 4, sample),

      fluid.pluginPodolski.select(),
      fluid.pluginPodolski.setEnv1Attack(attackVal),
      fluid.pluginPodolski.setEnv1Decay(decayVal),
      fluid.pluginPodolski.setEnv1Sustain(sustainVal),
      fluid.pluginPodolski.setEnv1Release(releaseVal),
      fluid.pluginPodolski.setOsc1Tune(oscTune(12)),
      fluid.pluginPodolski.setOsc1WaveWarp(wavewarpVal),
      fluid.pluginPodolski.setVcf0Cutoff(cutoffVal),
      fluid.pluginPodolski.setVcf0KeyFollow(1),
      fluid.pluginPodolski.setVccMode(0.3),

      fluid.pluginTStereoDelay.select(),
      fluid.pluginTStereoDelay.zero(),
      fluid.pluginTStereoDelay.setDelayMs(v.delay),
      fluid.pluginTStereoDelay.setFeedback(v.feedback),
    ]

    await client.send(msg);
      
    let renderMsg = [
      fluid.audiotrack.select('melody-podo'),
      fluid.audiotrack.renderRegion(
      path.join(
        __dirname, 
        'data', 
        `mel_${v.decay}_${v.predelay}_${v.size}_${v.damping}_${v.bandwidth}_${v.density}_${v.mix}_${v.earlylatemix}_.wav`
      ), 0, 8),
    ];

    await renderClient.send(renderMsg).then(() => {
      this.completed++;
      console.log(this.completed, 'out of', this.samples.length);
    });
  }

}

const params = [
  {param: 'delay', min: 0, max: 2000, numQueries: 10 },
  {param: 'feedback', min: -1, max: 1, numQueries: 10 },
]

let gen = new DelayGenerator(params, 1);
gen.generate();