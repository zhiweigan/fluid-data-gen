require('@tensorflow/tfjs-node');
const mvae = require('@magenta/music/node/music_vae');

export default class FluidModel {
  model: any;

  constructor(){
    // const melodyUrl = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_lokl_q2'

    // Download from the URL's using checkpoint_downloader, npm i --global http-server, 
    // then run the command http-server in the folder's root directory.
    const melodyUrl = 'http://localhost:8080/mel'

    this.model = new mvae.MusicVAE(melodyUrl)
  }
    
  async load(){
		try {
      await this.model.initialize();
		} catch (e){
      console.log(e)
		}
	}

	async sampleMel(count: number, temp=1){
		let outSequences = await this.model.sample(count, temp)
		return outSequences
  }
    
  melNotesToFluid(notes: any, stepsPerQuarter: number) {
    let fluidNotes = [];

    for (let note of notes){
      let start = note.quantizedStartStep / stepsPerQuarter / 4;
      let end = note.quantizedEndStep / stepsPerQuarter / 4;
      fluidNotes.push( {
          type: 'midiNote', 
          n: note.pitch, 
          startTime: start,
          length: end - start,
        }
      )
    }

    return fluidNotes;
  }
}

module.exports = FluidModel;