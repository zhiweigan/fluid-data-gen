const path    = require('path');
const fluid   = require('fluid-music');
const recipes = require('fluid-recipes');
const dragonflyRoom = fluid.pluginDragonflyRoomReverb;

const file    = path.join(process.cwd(), 'session.tracktionedit');
const client1 = new fluid.Client();
const client2 = new fluid.Client();


const wait = (timeMs: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('done'), timeMs);
  });
};

const msg = [
  fluid.global.activate(file, true),
  fluid.tempo.set(120),

  // chords
  fluid.audiotrack.select('melody-podo'),
  fluid.pluginPodolski.select(),
];

async function send() {
  await client1.send(msg);
  await wait(100);
  await client2.send(fluid.global.save());
}

send();
