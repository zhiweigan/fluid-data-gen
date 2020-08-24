import { Generator } from './gen-base';
import type * as fType from './types';
import path from 'path';
const fluid = require('fluid-music')

const oscTune = (v: number) => (v + 24) / 48;
const getRandom  = (min = 0, max = 1) => Math.random() * (max - min) + min;

class ReverbGenerator extends Generator {

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

      fluid.pluginTReverber8.select(),
      fluid.pluginTReverber8.zero(),
      fluid.pluginTReverber8.setDecay(v.decay),
      fluid.pluginTReverber8.setPredelayMs(v.predelay),
      fluid.pluginTReverber8.setSizePercent(v.size),
      fluid.pluginTReverber8.setDampingHz(v.damping),
      fluid.pluginTReverber8.setBandwidthHz(v.bandwidth),
      fluid.pluginTReverber8.setDensity(v.density),
      fluid.pluginTReverber8.setMixPercent(v.mix),
      fluid.pluginTReverber8.setEarlyLateMixPercent(v.earlylatemix),
    ]

    await client.send(msg);
      
    let renderMsg = [
      fluid.audiotrack.select('melody-podo'),
      fluid.audiotrack.renderRegion(
      path.join(
        __dirname, 
        'data', 
        `mel_${v.decay}_${v.predelay}_${v.size}_${v.damping}_${v.bandwidth}_${v.density}_${v.mix}_${v.earlylatemix}_${this.batchNum}_.wav`
      ), 0, 8),
    ];

    await renderClient.send(renderMsg).then(() => {
      this.completed++;
      console.log(this.completed, 'out of', this.samples.length);
    });
  }

}

const params = [
  {param: 'decay', min: 0, max: 0.8, numQueries: 2 },
  {param: 'predelay', min: 0, max: 200, numQueries: 2 },
  {param: 'size', min: 25, max: 75, numQueries: 2 },
  {param: 'damping', min: 100, max: 18500, numQueries: 2 },
  {param: 'bandwidth', min: 100, max: 18500, numQueries: 2 },
  {param: 'density', min: 0.1, max: 0.8, numQueries: 2 },
  {param: 'mix', min: 0, max: 100, numQueries: 2 },
  {param: 'earlylatemix', min: 0, max: 100, numQueries: 2 },
]

let gen = new ReverbGenerator(params, 2);
gen.generate();